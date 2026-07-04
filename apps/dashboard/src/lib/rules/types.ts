import type { Document, LineCounter } from 'yaml';

export enum DiagnosticSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface RuleDiagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  line: number;
  column: number;
}

export interface DiagnosticCollection {
  errors: RuleDiagnostic[];
  warnings: RuleDiagnostic[];
  info: RuleDiagnostic[];
}

export interface RuleMetadata {
  id: string;
  name?: string;
  description?: string;
  severity?: string;
  confidence?: string;
  recommendation?: string;
}

export interface RulePattern {
  id: string;
  regex: string;
  description?: string;
}

export interface RuleTestExpectation {
  decision?: 'ALLOW' | 'BLOCK';
  findings_count?: number;
  minimumRisk?: number;
  maximumRisk?: number;
  findings?: string[];
  forbiddenFindings?: string[];
  maximumLatency?: number;
}

export interface RuleTest {
  name?: string;
  prompt: string;
  expect: RuleTestExpectation;
}

export interface RuleDocument {
  ast: Document | null;
  lineCounter: LineCounter;
  raw: string;
  metadata: RuleMetadata;
  patterns: RulePattern[];
  tests: RuleTest[];
}
