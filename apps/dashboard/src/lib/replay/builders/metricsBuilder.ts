import { ReplaySession } from '../types';

export interface MetricsModel {
  currentTimeMs: number;
  eventsProcessed: number;
  currentHighestRisk: number;
  // Add other incremental metrics here
}

export class MetricsBuilder {
  /**
   * Computes the metrics incrementally up to a specific point in time during the replay.
   */
  public buildAtTime(session: ReplaySession, timeMs: number): MetricsModel {
    const sessionStart = session.events.length > 0 ? new Date(session.events[0].timestamp).getTime() : 0;
    
    // Filter events up to current time
    const pastEvents = session.events.filter(e => {
      const eTime = new Date(e.timestamp).getTime();
      return (eTime - sessionStart) <= timeMs;
    });

    const pastFindings = pastEvents.filter(e => e.type === 'finding');

    const currentHighestRisk = pastFindings.reduce((max, finding) => {
      const risk = finding.data?.riskScore || 0;
      return risk > max ? risk : max;
    }, 0);

    return {
      currentTimeMs: timeMs,
      eventsProcessed: pastEvents.length,
      currentHighestRisk,
    };
  }
}

