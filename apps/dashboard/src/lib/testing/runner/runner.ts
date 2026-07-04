import { RuleEvaluationService } from '@/lib/evaluation/service';
import { AssertionEngine } from '../assertions/engine';
import { TestReporter } from '../reporting/reporter';
import { TestSession, TestRunResult, AssertionStatus } from '../types';
import { RuleTest } from '@/lib/rules/types';

export class TestRunner {
  static async runSuite(
    yamlContent: string, 
    tests: RuleTest[], 
    reporter: TestReporter,
    signal?: AbortSignal
  ): Promise<TestSession> {
    const startedAt = new Date();
    reporter.onSessionStart(tests.length);
    
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const results: TestRunResult[] = [];

    for (const test of tests) {
      if (signal?.aborted) {
        break;
      }

      const start = performance.now();
      try {
        const result = await RuleEvaluationService.evaluate({
          prompt: test.prompt,
          rule: yamlContent,
          ruleId: 'test-runner',
          schemaVersion: 1
        }, signal as AbortSignal);

        const latency = performance.now() - start;
        const assertionResult = AssertionEngine.assert(result, test.expect);

        const runResult: TestRunResult = {
          test,
          evaluationResult: result,
          assertionResult,
          latency
        };

        if (assertionResult.status === AssertionStatus.PASS) passed++;
        else if (assertionResult.status === AssertionStatus.FAIL) failed++;
        else skipped++;

        results.push(runResult);
        reporter.onTestComplete(runResult);

      } catch (err) {
        // Handle evaluation error
        const latency = performance.now() - start;
        const runResult: TestRunResult = {
          test,
          assertionResult: {
            status: AssertionStatus.FAIL,
            failures: [{
              assertion: 'evaluation',
              expected: 'success',
              actual: 'error',
              message: err instanceof Error ? err.message : String(err)
            }]
          },
          latency
        };
        failed++;
        results.push(runResult);
        reporter.onTestComplete(runResult);
      }
    }

    const finishedAt = new Date();
    const duration = finishedAt.getTime() - startedAt.getTime();

    const session: TestSession = {
      startedAt,
      finishedAt,
      duration,
      total: tests.length,
      passed,
      failed,
      skipped,
      results
    };

    reporter.onSessionEnd(session);

    return session;
  }
}
