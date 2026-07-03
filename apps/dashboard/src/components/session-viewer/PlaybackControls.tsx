import React, { useEffect } from 'react';
import { useReplayPlayer } from '../../lib/replay/useReplayPlayer';
import { ReplayPlayer } from '../../lib/replay/replayPlayer';

interface PlaybackControlsProps {
  player: ReplayPlayer;
}

export function PlaybackControls({ player }: PlaybackControlsProps) {
  const { state, play, pause, jumpToStart, jumpToEnd, stepForward, stepBackward, setSpeed } = useReplayPlayer(player);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          state.status === 'playing' ? pause() : play();
          break;
        case 'ArrowRight':
          stepForward();
          break;
        case 'ArrowLeft':
          stepBackward();
          break;
        case 'Home':
          jumpToStart();
          break;
        case 'End':
          jumpToEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, play, pause, stepForward, stepBackward, jumpToStart, jumpToEnd]);

  return (
    <div className="flex items-center space-x-4 p-4 border-t bg-gray-50">
      <div className="flex space-x-2">
        <button onClick={jumpToStart} className="p-2 hover:bg-gray-200 rounded" title="Jump to Start (Home)">
          ⏮
        </button>
        <button onClick={() => stepBackward()} className="p-2 hover:bg-gray-200 rounded" title="Step Backward (Left Arrow)">
          ◀
        </button>
        <button 
          onClick={state.status === 'playing' ? pause : play} 
          className="p-2 hover:bg-gray-200 rounded"
          title="Play/Pause (Space)"
        >
          {state.status === 'playing' ? '⏸' : '▶'}
        </button>
        <button onClick={() => stepForward()} className="p-2 hover:bg-gray-200 rounded" title="Step Forward (Right Arrow)">
          ▶▶
        </button>
        <button onClick={jumpToEnd} className="p-2 hover:bg-gray-200 rounded" title="Jump to End (End)">
          ⏭
        </button>
      </div>
      
      <div className="flex space-x-2 border-l pl-4">
        {[0.5, 1, 2].map(speed => (
          <button
            key={speed}
            onClick={() => setSpeed(speed)}
            className={`px-3 py-1 text-sm rounded ${state.speed === speed ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
          >
            {speed}×
          </button>
        ))}
      </div>

      <div className="flex-grow text-right text-sm text-gray-500 font-mono">
        {state.currentTimeMs.toFixed(0)}ms / {state.durationMs}ms
      </div>
    </div>
  );
}
