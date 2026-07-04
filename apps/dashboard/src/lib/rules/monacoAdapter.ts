import type { editor, MarkerSeverity } from 'monaco-editor';
import { RuleDiagnostic, DiagnosticSeverity } from './types';

export function mapDiagnosticsToMarkers(diagnostics: RuleDiagnostic[]): editor.IMarkerData[] {
  return diagnostics.map(diag => {
    let severity = 4; // MarkerSeverity.Error

    switch (diag.severity) {
      case DiagnosticSeverity.ERROR:
        severity = 8; // MarkerSeverity.Error
        break;
      case DiagnosticSeverity.WARNING:
        severity = 4; // MarkerSeverity.Warning
        break;
      case DiagnosticSeverity.INFO:
        severity = 2; // MarkerSeverity.Info
        break;
    }

    return {
      severity,
      message: `${diag.message} [${diag.code}]`,
      startLineNumber: diag.line,
      startColumn: diag.column,
      endLineNumber: diag.line,
      // We don't have exact end columns for all AST nodes easily, so we can just highlight the start of the word or the whole line.
      // A common fallback is to make the squiggly span a few characters or to the end of the line.
      endColumn: diag.column + 5, 
    };
  });
}
