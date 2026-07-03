import React from 'react';
import { Play, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTestRunner } from '@/lib/testing/useTestRunner';
import { AssertionStatus, AssertionFailure } from '@/lib/testing/types';
import { RuleDocument } from '@/lib/rules/types';

interface TestRunnerUIProps {
  yamlContent: string;
  document: RuleDocument | null;
  isValid: boolean;
}

export function TestRunnerUI({ yamlContent, document, isValid }: TestRunnerUIProps) {
  const { runSuite, cancel, isRunning, session, liveResults, progress } = useTestRunner();
  
  const tests = document?.tests || [];
  const hasTests = tests.length > 0;

  const handleRun = () => {
    if (isValid && hasTests) {
      runSuite(yamlContent, tests);
    }
  };

  return (
    <div className="flex-1 bg-card/30 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          Testing Framework 
          {isRunning && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-blue-500/20 text-blue-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin"/> {progress.current} / {progress.total}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {isRunning ? (
            <button onClick={cancel} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded border border-border/50 hover:bg-secondary/80 flex items-center gap-1">Cancel</button>
          ) : null}
          <button 
            onClick={handleRun} 
            disabled={isRunning || !isValid || !hasTests}
            className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90 flex items-center gap-1 disabled:opacity-50"
          >
            <Play className="w-3 h-3"/> Run Suite
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!hasTests && !isRunning && !session && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
            No tests defined in this rule.
          </div>
        )}

        {hasTests && !isRunning && !session && liveResults.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
            Ready to run {tests.length} specification(s).
          </div>
        )}

        {/* Display Summary if session is finished */}
        {session && (
          <div className="mb-6 flex gap-4 text-sm font-bold border-b border-border/50 pb-4">
             <div className="flex items-center gap-1 text-success">
               <CheckCircle2 className="w-4 h-4"/> {session.passed} Passed
             </div>
             <div className="flex items-center gap-1 text-destructive">
               <XCircle className="w-4 h-4"/> {session.failed} Failed
             </div>
          </div>
        )}

        <div className="space-y-4">
          {liveResults.map((result, i) => {
            const isPass = result.assertionResult.status === AssertionStatus.PASS;
            const name = result.test.name || result.test.prompt;
            
            return (
              <div key={i} className={`border rounded p-3 ${isPass ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                <div className="flex items-center justify-between font-bold text-xs mb-2">
                   <div className="flex items-center gap-2">
                     {isPass ? <CheckCircle2 className="w-4 h-4 text-success"/> : <XCircle className="w-4 h-4 text-destructive"/>}
                     <span className="text-foreground">{name}</span>
                   </div>
                   <span className="text-muted-foreground font-mono">{Math.round(result.latency)}ms</span>
                </div>
                
                {!isPass && result.assertionResult.failures.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-destructive/20 pt-2">
                    {result.assertionResult.failures.map((f: AssertionFailure, idx: number) => (
                      <div key={idx} className="text-xs bg-destructive/10 border border-destructive/20 rounded p-2 text-destructive font-mono">
                        <div className="mb-1 font-bold">Failed Assertion: {f.assertion}</div>
                        <div className="opacity-80">Expected: {Array.isArray(f.expected) ? f.expected.join(', ') : String(f.expected)}</div>
                        <div className="opacity-80">Actual: {Array.isArray(f.actual) ? f.actual.join(', ') : String(f.actual)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
