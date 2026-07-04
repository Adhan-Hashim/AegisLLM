import { EvaluationResult } from '@/lib/evaluation/types';
import { RuleTestExpectation } from '@/lib/rules/types';
import { AssertionStatus, AssertionResult, AssertionFailure } from '../types';

export class AssertionEngine {
  static assert(result: EvaluationResult | null, expect: RuleTestExpectation): AssertionResult {
    if (!result) {
      return {
        status: AssertionStatus.FAIL,
        failures: [{
          assertion: 'result',
          expected: 'EvaluationResult',
          actual: 'null',
          message: 'Evaluation failed or returned no result.'
        }]
      };
    }

    const failures: AssertionFailure[] = [];

    // Check decision
    if (expect.decision !== undefined) {
      if (result.decision.action !== expect.decision) {
        failures.push({
          assertion: 'decision',
          expected: expect.decision,
          actual: result.decision.action,
          message: `Expected decision ${expect.decision} but got ${result.decision.action}`
        });
      }
    }

    // Check findings_count
    if (expect.findings_count !== undefined) {
      if (result.findings.length !== expect.findings_count) {
        failures.push({
          assertion: 'findings_count',
          expected: expect.findings_count,
          actual: result.findings.length,
          message: `Expected ${expect.findings_count} findings but got ${result.findings.length}`
        });
      }
    }

    // Check minimumRisk
    if (expect.minimumRisk !== undefined) {
      if (result.score < expect.minimumRisk) {
        failures.push({
          assertion: 'minimumRisk',
          expected: expect.minimumRisk,
          actual: result.score,
          message: `Expected risk >= ${expect.minimumRisk} but got ${result.score}`
        });
      }
    }

    // Check maximumRisk
    if (expect.maximumRisk !== undefined) {
      if (result.score > expect.maximumRisk) {
        failures.push({
          assertion: 'maximumRisk',
          expected: expect.maximumRisk,
          actual: result.score,
          message: `Expected risk <= ${expect.maximumRisk} but got ${result.score}`
        });
      }
    }

    // Check maximumLatency
    if (expect.maximumLatency !== undefined) {
      if (result.metrics.latency > expect.maximumLatency) {
        failures.push({
          assertion: 'maximumLatency',
          expected: expect.maximumLatency,
          actual: result.metrics.latency,
          message: `Expected latency <= ${expect.maximumLatency}ms but got ${result.metrics.latency}ms`
        });
      }
    }

    const actualFindingIds = result.findings.map(f => f.id);

    // Check required findings
    if (expect.findings !== undefined) {
      for (const findingId of expect.findings) {
        if (!actualFindingIds.includes(findingId)) {
          failures.push({
            assertion: 'findings',
            expected: findingId,
            actual: actualFindingIds.join(', ') || 'none',
            message: `Expected finding ${findingId} to be present.`
          });
        }
      }
    }

    // Check forbidden findings
    if (expect.forbiddenFindings !== undefined) {
      for (const findingId of expect.forbiddenFindings) {
        if (actualFindingIds.includes(findingId)) {
          failures.push({
            assertion: 'forbiddenFindings',
            expected: 'not present',
            actual: findingId,
            message: `Finding ${findingId} is forbidden but was detected.`
          });
        }
      }
    }

    return {
      status: failures.length > 0 ? AssertionStatus.FAIL : AssertionStatus.PASS,
      failures
    };
  }
}
