import { TestSession, TestRunResult } from '../types';

export interface TestReporter {
  onSessionStart(total: number): void;
  onTestComplete(result: TestRunResult): void;
  onSessionEnd(session: TestSession): void;
}

export class MemoryReporter implements TestReporter {
  private results: TestRunResult[] = [];
  private total = 0;
  private startedAt: Date | null = null;

  onSessionStart(total: number) {
    this.total = total;
    this.startedAt = new Date();
    this.results = [];
  }

  onTestComplete(result: TestRunResult) {
    this.results.push(result);
  }

  onSessionEnd(session: TestSession) {
    // Allows hooks into the end of a session, mostly for CLI or analytics.
  }

  getResults() {
    return this.results;
  }
}
