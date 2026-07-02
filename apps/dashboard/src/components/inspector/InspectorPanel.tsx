"use client";

import { useAttackLabStore } from "@/store/attackLab";
import { Terminal, Info, ShieldAlert, Cpu } from "lucide-react";

export function InspectorPanel() {
  const { inspectorData } = useAttackLabStore();

  if (!inspectorData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center border border-border/50 bg-card/30 rounded-lg">
        <Terminal className="w-8 h-8 mb-4 opacity-50" />
        <p className="text-sm">Click a timeline event or graph node to inspect details.</p>
      </div>
    );
  }

  const { title, raw } = inspectorData;

  return (
    <div className="h-full w-full flex flex-col border border-border/50 bg-card rounded-lg overflow-hidden">
      <div className="bg-secondary/50 border-b border-border/50 px-4 py-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Render intelligent specific fields if they exist */}
        {raw.severity && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-background border border-border/50 rounded p-3">
              <span className="text-xs uppercase text-muted-foreground block mb-1">Severity</span>
              <span className={`font-bold ${raw.severity === 'HIGH' || raw.severity === 'CRITICAL' ? 'text-destructive' : 'text-warning'}`}>
                {raw.severity}
              </span>
            </div>
            <div className="bg-background border border-border/50 rounded p-3">
              <span className="text-xs uppercase text-muted-foreground block mb-1">Confidence</span>
              <span className="font-bold">{(raw.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}
        
        {raw.matched_text && (
          <div className="mb-4 bg-background border border-border/50 rounded p-3">
            <span className="text-xs uppercase text-muted-foreground flex items-center gap-2 mb-2">
              <ShieldAlert className="w-3 h-3" /> Matched Evidence
            </span>
            <p className="text-sm font-mono text-destructive bg-destructive/10 p-2 rounded">{raw.matched_text}</p>
          </div>
        )}
        
        {raw.recommendation && (
          <div className="mb-4 bg-background border border-border/50 rounded p-3">
            <span className="text-xs uppercase text-muted-foreground flex items-center gap-2 mb-2">
              <Cpu className="w-3 h-3" /> Recommendation
            </span>
            <p className="text-sm text-foreground">{raw.recommendation}</p>
          </div>
        )}

        {/* Always show raw JSON fallback */}
        <div className="mt-4">
          <span className="text-xs uppercase text-muted-foreground block mb-2">Raw JSON</span>
          <pre className="text-xs font-mono bg-background border border-border/50 p-3 rounded-lg overflow-x-auto text-muted-foreground">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
