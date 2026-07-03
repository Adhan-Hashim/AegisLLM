import React, { useState, useMemo, useEffect } from 'react';
import { ReplaySession, InspectableItem, PlaybackFrame } from '../../lib/replay/types';
import { ReplayPlayer } from '../../lib/replay/replayPlayer';
import { useReplayPlayer } from '../../lib/replay/useReplayPlayer';
import { PlaybackControls } from './PlaybackControls';
import { TimelineBuilder } from '../../lib/replay/builders/timelineBuilder';
import { GraphBuilder } from '../../lib/replay/builders/graphBuilder';
import { MetricsBuilder } from '../../lib/replay/builders/metricsBuilder';
import { Timeline } from './Timeline';
import { ExplainabilityGraph } from '../explainability/ExplainabilityGraph';
import { Inspector } from './Inspector';

interface SessionViewerProps {
  session: ReplaySession;
  replayable?: boolean;
  developerMode?: boolean;
  initialTab?: string;
  onExport?: (session: ReplaySession) => void;
  onSelect?: (item: InspectableItem) => void;
  onReplayComplete?: () => void;
}

export function SessionViewer({ 
  session, 
  replayable = false, 
  developerMode = false,
  initialTab = 'timeline',
  onExport,
  onSelect,
  onReplayComplete
}: SessionViewerProps) {
  // Pure domain player
  const player = useMemo(() => new ReplayPlayer(session), [session]);
  const { state: playerState, play, pause, setSpeed, jumpToStart, jumpToEnd, stepForward, stepBackward } = useReplayPlayer(player);
  
  // Builders
  const timelineBuilder = useMemo(() => new TimelineBuilder(), []);
  const graphBuilder = useMemo(() => new GraphBuilder(), []); // In full version, graph might update incrementally too
  const metricsBuilder = useMemo(() => new MetricsBuilder(), []);

  // UI State
  const [selectedItem, setSelectedItem] = useState<InspectableItem | null>(null);

  // Compute the current PlaybackFrame
  const frame: PlaybackFrame = useMemo(() => {
    const timeMs = replayable ? playerState.currentTimeMs : session.metadata.durationMs;
    return {
      currentTimeMs: timeMs,
      timeline: timelineBuilder.buildAtTime(session, timeMs),
      graph: graphBuilder.build(session), // You could make graphBuilder incremental as well
      metrics: metricsBuilder.buildAtTime(session, timeMs),
      selected: selectedItem
    };
  }, [session, replayable, playerState.currentTimeMs, timelineBuilder, graphBuilder, metricsBuilder, selectedItem]);

  // Handle completion animation/event
  useEffect(() => {
    if (replayable && playerState.status === 'ended') {
      onReplayComplete?.();
    }
  }, [playerState.status, replayable, onReplayComplete]);

  const handleSelect = (id: string, data: any, type: InspectableItem['type']) => {
    const item: InspectableItem = { id, title: data.label || id, type, data };
    setSelectedItem(item);
    onSelect?.(item);
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded shadow-sm overflow-hidden">
      {/* Header Summary */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Session: {session.metadata.id}</h2>
          <p className="text-xs text-gray-500">Env: {session.metadata.environment} | Fingerprint: {session.fingerprint}</p>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Max Risk</div>
            <div className={`font-mono text-lg font-bold ${frame.metrics.currentHighestRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
              {frame.metrics.currentHighestRisk}
            </div>
          </div>
          {onExport && (
            <button onClick={() => onExport(session)} className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded text-sm text-gray-700">
              Export
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex min-h-0">
        {/* Left pane: Graph & Timeline */}
        <div className="flex-grow flex flex-col min-w-0 border-r">
          <div className="flex-grow min-h-0 relative">
            <ExplainabilityGraph 
              model={frame.graph} 
              selectedNodeId={frame.selected?.id}
              onNodeSelect={(id, data) => handleSelect(id, data, 'graph_node')}
            />
          </div>
          
          <div className="h-64 border-t min-h-0 bg-gray-50/50">
            <Timeline 
              model={frame.timeline}
              selectedId={frame.selected?.id}
              onSelect={(id, data) => handleSelect(id, data, 'timeline_item')}
            />
          </div>
        </div>

        {/* Right pane: Inspector */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white">
          <Inspector item={frame.selected} developerMode={developerMode} />
        </div>
      </div>

      {/* Footer: Playback Controls */}
      {replayable && (
        <PlaybackControls player={player} />
      )}
    </div>
  );
}
