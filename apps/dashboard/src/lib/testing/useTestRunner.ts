import { useState, useRef, useCallback } from 'react';
import { TestRunner } from './runner/runner';
import { MemoryReporter } from './reporting/reporter';
import { TestSession, TestRunResult } from './types';
import { RuleTest } from '@/lib/rules/types';

export function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<TestSession | null>(null);
  
  // Expose live results so UI can update while suite is running
  const [liveResults, setLiveResults] = useState<TestRunResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const runSuite = useCallback(async (yamlContent: string, tests: RuleTest[]) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRunning(true);
    setSession(null);
    setLiveResults([]);
    setProgress({ current: 0, total: tests.length });

    // Custom inline reporter to update React state during execution
    class ReactReporter extends MemoryReporter {
      onTestComplete(result: TestRunResult) {
        super.onTestComplete(result);
        setLiveResults([...this.getResults()]);
        setProgress(p => ({ ...p, current: p.current + 1 }));
      }
    }

    const reporter = new ReactReporter();

    try {
      const finalSession = await TestRunner.runSuite(yamlContent, tests, reporter, controller.signal);
      if (!controller.signal.aborted) {
        setSession(finalSession);
      }
    } catch (err) {
      console.error("Test suite failed:", err);
    } finally {
      setIsRunning(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    runSuite,
    cancel,
    isRunning,
    session,
    liveResults,
    progress
  };
}
