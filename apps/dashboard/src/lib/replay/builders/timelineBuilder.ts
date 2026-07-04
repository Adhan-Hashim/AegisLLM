import { ReplaySession, TimelineModel, TimelineItem, TimelineState } from '../types';

export class TimelineBuilder {
  public buildAtTime(session: ReplaySession, timeMs: number): TimelineModel {
    const items: TimelineItem[] = [];
    const sessionStart = session.events.length > 0 ? new Date(session.events[0].timestamp).getTime() : 0;

    session.events.forEach((event, idx) => {
      let type: TimelineItem['type'] = 'info';
      if (event.type === 'finding') type = 'warning';
      if (event.type === 'decision' && event.action === 'BLOCK') type = 'error';

      // Parse timestamp to ms
      const timestampMs = new Date(event.timestamp || Date.now()).getTime();
      const relativeTimeMs = timestampMs - sessionStart;
      
      let state = TimelineState.FUTURE;
      if (timeMs >= relativeTimeMs) {
        state = TimelineState.ACTIVE;
        // In a real implementation we might have a duration for events to go COMPLETE,
        // but for now, anything in the past is COMPLETE if it's older than 100ms
        if (timeMs > relativeTimeMs + 100) {
          state = TimelineState.COMPLETE;
        }
      }

      items.push({
        id: `timeline-event-${idx}`,
        timestampMs: relativeTimeMs,
        label: event.type ? event.type.toUpperCase() : 'EVENT',
        description: JSON.stringify(event.data || {}),
        type,
        state
      });
    });

    items.sort((a, b) => a.timestampMs - b.timestampMs);

    return { items };
  }
}
