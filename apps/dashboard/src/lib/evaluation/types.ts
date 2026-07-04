export enum EvaluationState {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  RUNNING = 'RUNNING',
  CANCELLING = 'CANCELLING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED'
}

export interface EvaluationRequest {
  prompt: string;
  rule: string;
  ruleId: string;
  schemaVersion: number;
}

export interface EvaluationMetrics {
  latency: number;
  requestSize?: number;
  responseSize?: number;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface Finding {
  id: string;
  description: string;
  severity: string;
  confidence: number;
}

export interface Decision {
  action: string;
  reason?: string;
}

export interface EvaluationResult {
  decision: Decision;
  score: number;
  findings: Finding[];
  timeline: TimelineEvent[];
  metrics: EvaluationMetrics;
}

export interface EvaluationSession {
  id: string;
  startedAt: Date;
  finishedAt?: Date;
  state: EvaluationState;
  request: EvaluationRequest;
  result?: EvaluationResult;
  error?: EvaluationError;
}

export interface EvaluationError {
  code: string;
  message: string;
  retryable: boolean;
}

export const EvaluationErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CANCELLED: 'CANCELLED'
} as const;

export interface EvaluationHistory {
  sessions: EvaluationSession[];
}

export enum ChangeType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  MODIFIED = 'MODIFIED'
}

export interface DiffSummary {
  totalChanges: number;
  breaking: boolean;
  behaviorChanged: boolean;
}

export interface FindingDiff {
  type: ChangeType;
  finding: Finding;
  previousFinding?: Finding;
}

export interface EvaluationDiffResult {
  scoreDelta: number;
  decisionChanged: boolean;
  latencyDelta: number;
  severityChanged: boolean;
  
  findingsAdded: Finding[];
  findingsRemoved: Finding[];
  findingsModified: FindingDiff[];
  
  addedRules: string[];
  removedRules: string[];
  
  summary: DiffSummary;
}

