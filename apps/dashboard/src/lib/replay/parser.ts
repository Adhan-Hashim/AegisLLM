import { ReplaySession, ReplayMetadata } from './types';

/**
 * ReplayParser is responsible for converting raw audit logs or JSONL streams
 * into the canonical ReplaySession domain model.
 */
export class ReplayParser {
  /**
   * Parse a raw array of event logs into a ReplaySession.
   * @param rawData Array of raw audit events (e.g., from a JSONL file)
   */
  public parse(rawData: any[]): ReplaySession {
    if (!rawData || rawData.length === 0) {
      throw new Error('Cannot parse empty audit log into a ReplaySession.');
    }

    // In a real implementation, we would extract these from the raw events.
    // We assume the first event might contain session metadata.
    const firstEvent = rawData[0];
    const lastEvent = rawData[rawData.length - 1];

    const metadata: ReplayMetadata = {
      id: firstEvent.sessionId || 'unknown-session',
      timestamp: firstEvent.timestamp || new Date().toISOString(),
      environment: firstEvent.environment || 'production',
      durationMs: this.calculateDuration(firstEvent, lastEvent),
    };

    const findings = rawData.filter(e => e.type === 'finding');
    const decisions = rawData.filter(e => e.type === 'decision');

    const highestRisk = findings.reduce((max, finding) => {
      const risk = finding.data?.riskScore || 0;
      return risk > max ? risk : max;
    }, 0);

    return {
      metadata,
      events: rawData,
      findings,
      decision: decisions[decisions.length - 1] || null, // Final decision
      fingerprint: firstEvent.fingerprint || 'unknown-fingerprint',
      metrics: {
        totalEvents: rawData.length,
        highestRisk,
        latencyMs: metadata.durationMs,
      },
    };
  }

  private calculateDuration(firstEvent: any, lastEvent: any): number {
    if (!firstEvent.timestamp || !lastEvent.timestamp) return 0;
    const start = new Date(firstEvent.timestamp).getTime();
    const end = new Date(lastEvent.timestamp).getTime();
    return Math.max(0, end - start);
  }
}
