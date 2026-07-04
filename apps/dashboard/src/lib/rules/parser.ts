import { parseDocument, Document, LineCounter } from 'yaml';
import { RuleDocument, RuleDiagnostic, DiagnosticSeverity, RuleMetadata, RulePattern, RuleTest, RuleTestExpectation } from './types';

export interface ParseResult {
  document: RuleDocument;
  syntaxDiagnostics: RuleDiagnostic[];
}

export function parseRule(content: string): ParseResult {
  const lineCounter = new LineCounter();
  const ast = parseDocument(content, { lineCounter, keepSourceTokens: true });
  const syntaxDiagnostics: RuleDiagnostic[] = [];

  // Convert YAML parser errors to Syntax Diagnostics
  for (const error of ast.errors) {
    let line = 1;
    let column = 1;
    if (error.pos) {
      const pos = lineCounter.linePos(error.pos[0]);
      if (pos) {
        line = pos.line;
        column = pos.col;
      }
    }
    syntaxDiagnostics.push({
      code: 'YAML001',
      severity: DiagnosticSeverity.ERROR,
      message: error.message,
      line,
      column,
    });
  }

  // Convert YAML parser warnings
  for (const warning of ast.warnings) {
    let line = 1;
    let column = 1;
    if (warning.pos) {
      const pos = lineCounter.linePos(warning.pos[0]);
      if (pos) {
        line = pos.line;
        column = pos.col;
      }
    }
    syntaxDiagnostics.push({
      code: 'YAML002',
      severity: DiagnosticSeverity.WARNING,
      message: warning.message,
      line,
      column,
    });
  }

  // Extract Metadata and Patterns safely
  const jsDoc = ast.toJSON() || {};
  
  const metadata: RuleMetadata = {
    id: typeof jsDoc.id === 'string' ? jsDoc.id : '',
    name: typeof jsDoc.name === 'string' ? jsDoc.name : undefined,
    description: typeof jsDoc.description === 'string' ? jsDoc.description : undefined,
    severity: typeof jsDoc.severity === 'string' ? jsDoc.severity : undefined,
    confidence: typeof jsDoc.confidence === 'string' ? jsDoc.confidence : undefined,
    recommendation: typeof jsDoc.recommendation === 'string' ? jsDoc.recommendation : undefined,
  };

  const patterns: RulePattern[] = [];
  if (Array.isArray(jsDoc.patterns)) {
    for (const p of jsDoc.patterns) {
      if (typeof p === 'object' && p !== null) {
        patterns.push({
          id: typeof p.id === 'string' ? p.id : '',
          regex: typeof p.regex === 'string' ? p.regex : '',
          description: typeof p.description === 'string' ? p.description : undefined,
        });
      }
    }
  }

  const tests: RuleTest[] = [];
  if (Array.isArray(jsDoc.tests)) {
    for (const t of jsDoc.tests) {
      if (typeof t === 'object' && t !== null && typeof t.prompt === 'string') {
        const expectObj = typeof t.expect === 'object' && t.expect !== null ? t.expect : (typeof t.expected === 'object' && t.expected !== null ? t.expected : {});
        const expectation: RuleTestExpectation = {
          decision: typeof expectObj.decision === 'string' ? expectObj.decision : undefined,
          findings_count: typeof expectObj.findings_count === 'number' ? expectObj.findings_count : undefined,
          minimumRisk: typeof expectObj.minimumRisk === 'number' ? expectObj.minimumRisk : undefined,
          maximumRisk: typeof expectObj.maximumRisk === 'number' ? expectObj.maximumRisk : undefined,
          maximumLatency: typeof expectObj.maximumLatency === 'number' ? expectObj.maximumLatency : undefined,
          findings: Array.isArray(expectObj.findings) ? expectObj.findings : undefined,
          forbiddenFindings: Array.isArray(expectObj.forbiddenFindings) ? expectObj.forbiddenFindings : undefined,
        };
        tests.push({
          name: typeof t.name === 'string' ? t.name : undefined,
          prompt: t.prompt,
          expect: expectation
        });
      }
    }
  }

  const document: RuleDocument = {
    ast,
    lineCounter,
    raw: content,
    metadata,
    patterns,
    tests,
  };

  return {
    document,
    syntaxDiagnostics,
  };
}
