import { ReplayParser } from '../parser';

describe('ReplayParser', () => {
  it('should parse raw JSONL events into a ReplaySession', () => {
    const rawEvents = [
      { type: 'start', sessionId: 'session-123', timestamp: '2026-07-01T10:00:00.000Z', environment: 'dev', fingerprint: 'hash123' },
      { type: 'finding', timestamp: '2026-07-01T10:00:00.100Z', data: { riskScore: 42 } },
      { type: 'finding', timestamp: '2026-07-01T10:00:00.200Z', data: { riskScore: 88 } },
      { type: 'decision', timestamp: '2026-07-01T10:00:00.300Z', action: 'BLOCK' }
    ];

    const parser = new ReplayParser();
    const session = parser.parse(rawEvents);

    expect(session.metadata.id).toBe('session-123');
    expect(session.metadata.environment).toBe('dev');
    expect(session.metadata.durationMs).toBe(300); // 300ms difference
    expect(session.events).toHaveLength(4);
    expect(session.findings).toHaveLength(2);
    expect(session.decision.action).toBe('BLOCK');
    expect(session.metrics.highestRisk).toBe(88);
  });

  it('should throw an error on empty input', () => {
    const parser = new ReplayParser();
    expect(() => parser.parse([])).toThrow('Cannot parse empty audit log into a ReplaySession.');
  });
});
