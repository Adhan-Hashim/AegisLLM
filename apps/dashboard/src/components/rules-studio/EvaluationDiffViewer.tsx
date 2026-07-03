import React from 'react';
import { EvaluationSession, EvaluationDiffResult, ChangeType, Finding } from '@/lib/evaluation/types';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface EvaluationDiffViewerProps {
  currentSession: EvaluationSession;
  previousSession?: EvaluationSession | null;
  diffResult: EvaluationDiffResult | null;
}

export function EvaluationDiffViewer({ currentSession, previousSession, diffResult }: EvaluationDiffViewerProps) {
  
  // If there's no previous session, it's the baseline.
  if (!previousSession || !diffResult) {
    return (
      <div className="flex flex-col h-full space-y-4">
        <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-primary">Baseline Evaluation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Future evaluations of this rule will be compared against this baseline result.
            </p>
          </div>
        </div>

        <div className="glass-card p-4 flex-1">
           <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Evaluation Results</h3>
           <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col border border-border/50 rounded p-3 text-center">
                 <span className="text-xs text-muted-foreground uppercase mb-1">Decision</span>
                 <span className={`text-lg font-bold ${currentSession.result?.decision.action === 'BLOCK' ? 'text-destructive' : 'text-success'}`}>{currentSession.result?.decision.action}</span>
              </div>
              <div className="flex flex-col border border-border/50 rounded p-3 text-center">
                 <span className="text-xs text-muted-foreground uppercase mb-1">Risk Score</span>
                 <span className="text-lg font-bold text-primary">{currentSession.result?.score}</span>
              </div>
           </div>
           
           <div className="space-y-2">
             {currentSession.result?.findings.map((f, i) => (
               <div key={i} className="text-xs border border-border/50 rounded p-2 mb-2 bg-secondary/30">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-primary font-bold">{f.id}</span>
                   <span className="text-destructive text-[10px] bg-destructive/10 px-2 py-0.5 rounded">{f.severity}</span>
                 </div>
                 <p className="text-muted-foreground">{f.description}</p>
               </div>
             ))}
             {currentSession.result?.findings.length === 0 && (
               <div className="text-xs text-muted-foreground text-center p-4">No findings detected.</div>
             )}
           </div>
        </div>
      </div>
    );
  }

  // Side-by-side diff rendering
  return (
    <div className="flex flex-col space-y-4">
      {diffResult.summary.behaviorChanged && (
        <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-destructive">Behavior Changed</h3>
            <p className="text-xs text-destructive/80 mt-1">
              This rule evaluation produced a different outcome compared to the previous run.
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side Matrix */}
      <div className="glass-card p-0 flex flex-col overflow-hidden border border-border/50">
        <div className="grid grid-cols-2 bg-secondary/50 border-b border-border/50">
           <div className="p-3 text-center font-bold text-xs text-muted-foreground border-r border-border/50 uppercase tracking-wider">Previous</div>
           <div className="p-3 text-center font-bold text-xs text-primary uppercase tracking-wider">Current</div>
        </div>

        {/* Decision Row */}
        <div className="grid grid-cols-2 border-b border-border/50">
           <div className="p-4 text-center border-r border-border/50 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Decision</span>
              <span className={`text-xl font-bold ${previousSession.result?.decision.action === 'BLOCK' ? 'text-destructive' : 'text-success'}`}>{previousSession.result?.decision.action}</span>
           </div>
           <div className="p-4 text-center flex flex-col items-center justify-center relative">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Decision</span>
              <span className={`text-xl font-bold ${currentSession.result?.decision.action === 'BLOCK' ? 'text-destructive' : 'text-success'}`}>{currentSession.result?.decision.action}</span>
              {diffResult.decisionChanged && (
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-primary">
                   <ArrowRight className="w-6 h-6" />
                </div>
              )}
           </div>
        </div>

        {/* Score Row */}
        <div className="grid grid-cols-2 border-b border-border/50 bg-secondary/10">
           <div className="p-4 text-center border-r border-border/50 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Risk Score</span>
              <span className="text-xl font-bold font-mono">{previousSession.result?.score}</span>
           </div>
           <div className="p-4 text-center flex flex-col items-center justify-center relative">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Risk Score</span>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold font-mono">{currentSession.result?.score}</span>
                 {diffResult.scoreDelta !== 0 && (
                   <span className={`text-xs font-bold ${diffResult.scoreDelta > 0 ? 'text-destructive' : 'text-success'}`}>
                     ({diffResult.scoreDelta > 0 ? '▲' : '▼'} {Math.abs(diffResult.scoreDelta)})
                   </span>
                 )}
              </div>
           </div>
        </div>

        {/* Latency Row */}
        <div className="grid grid-cols-2 border-b border-border/50">
           <div className="p-3 text-center border-r border-border/50 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Latency</span>
              <span className="text-sm font-mono text-muted-foreground">{previousSession.result?.metrics.latency} ms</span>
           </div>
           <div className="p-3 text-center flex flex-col items-center justify-center relative">
              <span className="text-[10px] uppercase text-muted-foreground mb-1">Latency</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-mono text-muted-foreground">{currentSession.result?.metrics.latency} ms</span>
                 {diffResult.latencyDelta !== 0 && (
                   <span className={`text-[10px] ${diffResult.latencyDelta > 0 ? 'text-destructive' : 'text-success'}`}>
                     ({diffResult.latencyDelta > 0 ? '+' : ''}{diffResult.latencyDelta} ms)
                   </span>
                 )}
              </div>
           </div>
        </div>
        
        {/* Findings Row */}
        <div className="grid grid-cols-2 bg-secondary/10">
           <div className="p-4 border-r border-border/50">
              <div className="text-[10px] uppercase text-muted-foreground mb-3 text-center">Findings</div>
              <div className="space-y-2">
                 {previousSession.result?.findings.map((f, i) => (
                   <div key={i} className="text-xs border border-border/50 rounded p-2 bg-background">
                     <div className="font-bold text-muted-foreground">{f.id}</div>
                     <div className="text-[10px] text-muted-foreground/70 truncate">{f.description}</div>
                   </div>
                 ))}
                 {previousSession.result?.findings.length === 0 && (
                   <div className="text-xs text-muted-foreground text-center">No findings.</div>
                 )}
              </div>
           </div>
           
           <div className="p-4">
              <div className="text-[10px] uppercase text-muted-foreground mb-3 text-center">Findings</div>
              <div className="space-y-2">
                 {currentSession.result?.findings.map((f, i) => {
                   // Determine if added/modified/unchanged
                   const isAdded = diffResult.findingsAdded.some(added => added.id === f.id && added.description === f.description);
                   const isModified = diffResult.findingsModified.some(mod => mod.finding.id === f.id && mod.finding.description === f.description);
                   
                   let badge = null;
                   let bgClass = "bg-background border-border/50";
                   
                   if (isAdded) {
                     badge = <span className="text-[10px] font-bold text-success bg-success/10 px-1 rounded">(+) Added</span>;
                     bgClass = "bg-success/5 border-success/30";
                   } else if (isModified) {
                     badge = <span className="text-[10px] font-bold text-primary bg-primary/10 px-1 rounded">(~) Modified</span>;
                     bgClass = "bg-primary/5 border-primary/30";
                   } else {
                     badge = <span className="text-[10px] text-muted-foreground">(≈) Unchanged</span>;
                   }

                   return (
                     <div key={i} className={`text-xs border rounded p-2 ${bgClass}`}>
                       <div className="flex justify-between items-center mb-1">
                         <div className="font-bold">{f.id}</div>
                         {badge}
                       </div>
                       <div className="text-[10px] text-muted-foreground truncate">{f.description}</div>
                     </div>
                   );
                 })}

                 {/* Show removed findings strictly for visibility */}
                 {diffResult.findingsRemoved.map((f, i) => (
                   <div key={`rem-${i}`} className="text-xs border border-destructive/30 bg-destructive/5 rounded p-2 opacity-60">
                       <div className="flex justify-between items-center mb-1">
                         <div className="font-bold line-through">{f.id}</div>
                         <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1 rounded">(−) Removed</span>
                       </div>
                       <div className="text-[10px] text-muted-foreground truncate line-through">{f.description}</div>
                   </div>
                 ))}
                 
                 {currentSession.result?.findings.length === 0 && diffResult.findingsRemoved.length === 0 && (
                   <div className="text-xs text-muted-foreground text-center">No findings.</div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
