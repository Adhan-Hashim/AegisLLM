import { useEffect, useState, useMemo } from 'react';
import { ReplayPlayer } from './replayPlayer';
import { ReplayState } from './types';

export function useReplayPlayer(player: ReplayPlayer) {
  const [state, setState] = useState<ReplayState>(player.getState());

  useEffect(() => {
    const unsubscribe = player.subscribe((newState: ReplayState) => {
      setState(newState);
    });
    return unsubscribe;
  }, [player]);

  return {
    state,
    play: () => player.play(),
    pause: () => player.pause(),
    seek: (timeMs: number) => player.seek(timeMs),
    stepForward: (stepMs?: number) => player.stepForward(stepMs),
    stepBackward: (stepMs?: number) => player.stepBackward(stepMs),
    jumpToStart: () => player.jumpToStart(),
    jumpToEnd: () => player.jumpToEnd(),
    setSpeed: (speed: number) => player.setSpeed(speed),
    session: player.getSession(),
  };
}
