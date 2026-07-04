import { ReplaySession, ReplayState } from './types';

type Listener = (state: ReplayState) => void;

/**
 * ReplayPlayer is a pure domain object responsible for managing
 * the playback state of a ReplaySession. It is framework-agnostic
 * and uses a simple subscription model to notify the UI of state changes.
 */
export class ReplayPlayer {
  private session: ReplaySession;
  private state: ReplayState;
  private listeners: Set<Listener> = new Set();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private updateIntervalMs = 50; // Update 20 times a second

  constructor(session: ReplaySession) {
    this.session = session;
    this.state = {
      status: 'paused',
      currentTimeMs: 0,
      speed: 1,
      durationMs: session.metadata.durationMs,
    };
  }

  public getState(): ReplayState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Emit initial state immediately
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private updateState(partialState: Partial<ReplayState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  public play() {
    if (this.state.status === 'playing') return;

    if (this.state.currentTimeMs >= this.state.durationMs) {
      this.state.currentTimeMs = 0; // Auto-reset if ended
    }

    this.updateState({ status: 'playing' });

    let lastTick = Date.now();
    this.timerId = setInterval(() => {
      const now = Date.now();
      const deltaMs = (now - lastTick) * this.state.speed;
      lastTick = now;

      const nextTime = this.state.currentTimeMs + deltaMs;

      if (nextTime >= this.state.durationMs) {
        this.pause();
        this.updateState({ currentTimeMs: this.state.durationMs, status: 'ended' });
      } else {
        this.updateState({ currentTimeMs: nextTime });
      }
    }, this.updateIntervalMs);
  }

  public pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.state.status === 'playing') {
      this.updateState({ status: 'paused' });
    }
  }

  public seek(timeMs: number) {
    const safeTime = Math.max(0, Math.min(timeMs, this.state.durationMs));
    this.updateState({ 
      currentTimeMs: safeTime,
      status: safeTime >= this.state.durationMs ? 'ended' : this.state.status === 'ended' ? 'paused' : this.state.status
    });
  }

  public stepForward(stepMs = 100) {
    this.pause();
    this.seek(this.state.currentTimeMs + stepMs);
  }

  public stepBackward(stepMs = 100) {
    this.pause();
    this.seek(this.state.currentTimeMs - stepMs);
  }

  public jumpToStart() {
    this.pause();
    this.seek(0);
  }

  public jumpToEnd() {
    this.pause();
    this.seek(this.state.durationMs);
  }

  public setSpeed(speed: number) {
    this.updateState({ speed });
  }

  public getSession(): ReplaySession {
    return this.session;
  }
}
