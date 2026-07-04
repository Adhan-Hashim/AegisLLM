import { EvaluationApiClient } from './apiClient';
import { 
  EvaluationRequest, 
  EvaluationResult, 
  TimelineEvent, 
  Finding, 
  Decision, 
  EvaluationMetrics
} from './types';

export class RuleEvaluationService {
  static async evaluate(request: EvaluationRequest, signal: AbortSignal): Promise<EvaluationResult> {
    const startTime = performance.now();
    
    // Delegate network transport to API client
    const rawResponse = await EvaluationApiClient.evaluate(request, signal);
    
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // Normalize raw backend JSON into our domain's EvaluationResult
    const decision: Decision = {
      action: rawResponse.decision?.action || 'ALLOW',
      reason: rawResponse.decision?.reason
    };

    const score = rawResponse.risk?.score || 0;

    const findings: Finding[] = (rawResponse.findings || []).map((f: any) => ({
      id: f.id || 'unknown',
      description: f.description || '',
      severity: f.severity || 'LOW',
      confidence: f.confidence || 0,
    }));

    const timeline: TimelineEvent[] = (rawResponse.timeline || []).map((t: any) => ({
      event: t.event || 'Unknown',
      timestamp: t.timestamp || new Date().toISOString(),
      details: t.details || {},
    }));

    const metrics: EvaluationMetrics = {
      latency,
      // In a real app we'd measure payload size
      requestSize: 0,
      responseSize: 0,
    };

    return {
      decision,
      score,
      findings,
      timeline,
      metrics
    };
  }
}
