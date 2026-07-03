import React from 'react';
import { Activity, Clock, Cpu, HardDrive, List, Layout } from 'lucide-react';

interface DiagnosticsPanelProps {
  // Pass in any specific data you want, or compute it locally.
  // For v1, this can be static mocks or real data where available.
  metrics?: {
    renderTimeMs?: number;
    replayFps?: number;
    graphNodeCount?: number;
    timelineLength?: number;
    memoryMb?: number;
    evaluationLatencyMs?: number;
  };
}

export function DiagnosticsPanel({ metrics }: DiagnosticsPanelProps) {
  // Use provided metrics or sensible defaults for the demo
  const data = {
    renderTimeMs: metrics?.renderTimeMs ?? 2.4,
    replayFps: metrics?.replayFps ?? 60,
    graphNodeCount: metrics?.graphNodeCount ?? 12,
    timelineLength: metrics?.timelineLength ?? 45,
    memoryMb: metrics?.memoryMb ?? 42.8,
    evaluationLatencyMs: metrics?.evaluationLatencyMs ?? 14
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-200 rounded-lg shadow-inner border border-gray-700 font-mono text-xs">
      <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase tracking-widest font-bold">
        <Activity className="w-4 h-4" />
        Product Analytics (Dev Mode)
      </div>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Layout className="w-3 h-3" />
            <span>Render Time</span>
          </div>
          <span className="text-lg font-semibold text-white">{data.renderTimeMs.toFixed(1)}ms</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Activity className="w-3 h-3" />
            <span>Replay FPS</span>
          </div>
          <span className={`text-lg font-semibold ${data.replayFps >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            {data.replayFps}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <List className="w-3 h-3" />
            <span>Graph Nodes</span>
          </div>
          <span className="text-lg font-semibold text-blue-300">{data.graphNodeCount}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <List className="w-3 h-3" />
            <span>Timeline Events</span>
          </div>
          <span className="text-lg font-semibold text-blue-300">{data.timelineLength}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <HardDrive className="w-3 h-3" />
            <span>Memory (Heap)</span>
          </div>
          <span className="text-lg font-semibold text-indigo-300">{data.memoryMb.toFixed(1)}MB</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Clock className="w-3 h-3" />
            <span>Eval Latency</span>
          </div>
          <span className="text-lg font-semibold text-orange-300">{data.evaluationLatencyMs}ms</span>
        </div>
      </div>
    </div>
  );
}
