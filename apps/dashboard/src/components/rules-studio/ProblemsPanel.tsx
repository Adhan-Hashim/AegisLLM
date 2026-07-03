import React from 'react';
import { DiagnosticCollection, RuleDiagnostic, DiagnosticSeverity } from '@/lib/rules/types';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ProblemsPanelProps {
  diagnostics: DiagnosticCollection;
  onJumpToLine: (line: number, column: number) => void;
  onClose: () => void;
}

export function ProblemsPanel({ diagnostics, onJumpToLine, onClose }: ProblemsPanelProps) {
  const total = diagnostics.errors.length + diagnostics.warnings.length + diagnostics.info.length;
  if (total === 0) return null;

  const renderDiagnostic = (diag: RuleDiagnostic, icon: React.ReactNode, textClass: string) => (
    <div 
      key={`${diag.code}-${diag.line}-${diag.column}`}
      className="flex items-start gap-2 py-1.5 px-2 hover:bg-secondary/50 cursor-pointer rounded group"
      onClick={() => onJumpToLine(diag.line, diag.column)}
    >
      <div className={`mt-0.5 ${textClass}`}>{icon}</div>
      <div className="flex-1 text-xs">
        <span className="font-semibold mr-2">{diag.code}</span>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{diag.message}</span>
      </div>
      <div className="text-xs text-muted-foreground w-16 text-right tabular-nums">
        [{diag.line}, {diag.column}]
      </div>
    </div>
  );

  return (
    <div className="h-48 border-t border-border/50 bg-[#1e1e1e] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/50">
        <div className="flex gap-4 text-xs font-semibold">
          <span className="text-muted-foreground uppercase tracking-wider">Problems</span>
          {diagnostics.errors.length > 0 && (
            <span className="flex items-center gap-1 text-destructive"><AlertCircle className="w-3 h-3" /> Errors ({diagnostics.errors.length})</span>
          )}
          {diagnostics.warnings.length > 0 && (
            <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-3 h-3" /> Warnings ({diagnostics.warnings.length})</span>
          )}
          {diagnostics.info.length > 0 && (
            <span className="flex items-center gap-1 text-blue-400"><Info className="w-3 h-3" /> Info ({diagnostics.info.length})</span>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {diagnostics.errors.map(d => renderDiagnostic(d, <AlertCircle className="w-3 h-3" />, 'text-destructive'))}
        {diagnostics.warnings.map(d => renderDiagnostic(d, <AlertTriangle className="w-3 h-3" />, 'text-amber-500'))}
        {diagnostics.info.map(d => renderDiagnostic(d, <Info className="w-3 h-3" />, 'text-blue-400'))}
      </div>
    </div>
  );
}
