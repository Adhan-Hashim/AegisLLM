import { ReplayPlayer } from '../replayPlayer';
import { ReplaySession } from '../types';

describe('ReplayPlayer', () => {
  let mockSession: ReplaySession;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSession = {
      metadata: { id: 'test', timestamp: '2026-07-01', environment: 'dev', durationMs: 1000 },
      events: [],
      findings: [],
      decision: null,
      fingerprint: 'test',
      metrics: { totalEvents: 0, highestRisk: 0, latencyMs: 1000 }
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize correctly', () => {
    const player = new ReplayPlayer(mockSession);
    expect(player.getState().status).toBe('paused');
    expect(player.getState().currentTimeMs).toBe(0);
    expect(player.getState().durationMs).toBe(1000);
  });

  it('should notify subscribers on state change', () => {
    const player = new ReplayPlayer(mockSession);
    const listener = jest.fn();
    
    player.subscribe(listener);
    // Initial call
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ status: 'paused' }));

    player.setSpeed(2);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ speed: 2 }));
  });

  it('should update currentTimeMs while playing', () => {
    const player = new ReplayPlayer(mockSession);
    player.play();
    
    expect(player.getState().status).toBe('playing');
    
    // Advance time by 100ms
    jest.advanceTimersByTime(100);
    expect(player.getState().currentTimeMs).toBeGreaterThan(0);
  });

  it('should pause playback', () => {
    const player = new ReplayPlayer(mockSession);
    player.play();
    player.pause();
    expect(player.getState().status).toBe('paused');
  });

  it('should jump to start and end', () => {
    const player = new ReplayPlayer(mockSession);
    player.jumpToEnd();
    expect(player.getState().currentTimeMs).toBe(1000);
    expect(player.getState().status).toBe('ended');

    player.jumpToStart();
    expect(player.getState().currentTimeMs).toBe(0);
    expect(player.getState().status).toBe('paused'); // Jumps pause playback
  });

  it('should step forward and backward', () => {
    const player = new ReplayPlayer(mockSession);
    player.stepForward(200);
    expect(player.getState().currentTimeMs).toBe(200);

    player.stepBackward(50);
    expect(player.getState().currentTimeMs).toBe(150);
  });
});
