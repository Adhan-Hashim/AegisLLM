import { EvaluationResult } from '@/lib/evaluation/types';
import { RuleTestExpectation, RuleTest } from '@/lib/rules/types';

export enum AssertionStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  SKIPPED = 'SKIPPED'
}

export interface AssertionFailure {
  assertion: string;
  expected: string | number | string[];
  actual: string | number | string[];
  message: string;
}

export interface AssertionResult {
  status: AssertionStatus;
  failures: AssertionFailure[];
}

export interface TestRunResult {
  test: RuleTest;
  evaluationResult?: EvaluationResult;
  assertionResult: AssertionResult;
  latency: number;
}

export interface TestSession {
  startedAt: Date;
  finishedAt: Date | null;
  duration: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestRunResult[];
}
