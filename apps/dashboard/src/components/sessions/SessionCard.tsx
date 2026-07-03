import React from 'react';
import { ReplaySession } from '../../lib/replay/types';

interface SessionCardProps {
  session: ReplaySession;
  isSelected: boolean;
  isPinned: boolean;
  onSelect: (session: ReplaySession) => void;
  onTogglePin: (e: React.MouseEvent, sessionId: string) => void;
}

export function SessionCard({ session, isSelected, isPinned, onSelect, onTogglePin }: SessionCardProps) {
  const { decision, metrics, fingerprint, metadata, findings } = session;
  
  // Format the time
  const timeStr = new Date(metadata.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Get primary category if any
  const primaryCategory = findings.length > 0 ? findings[0].data?.category : 'Safe';
  
  // Decision colors
  let decisionColor = 'bg-gray-100 text-gray-800';
  if (decision?.action === 'BLOCK') decisionColor = 'bg-red-100 text-red-800 border-red-200';
  else if (decision?.action === 'ALLOW') decisionColor = 'bg-green-100 text-green-800 border-green-200';
  else if (decision?.action === 'REVIEW') decisionColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';

  return (
    <div 
      onClick={() => onSelect(session)}
      className={`p-4 border rounded cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white hover:border-gray-300'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {fingerprint.substring(0, 8)}
          </span>
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase border ${decisionColor}`}>
            {decision?.action || 'UNKNOWN'}
          </span>
        </div>
        <button 
          onClick={(e) => onTogglePin(e, metadata.id)}
          className={`text-lg transition-colors ${isPinned ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
          title={isPinned ? 'Unpin Session' : 'Pin Session'}
        >
          {isPinned ? '★' : '☆'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">Category</div>
          <div className="font-medium text-gray-900 truncate">{primaryCategory}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Risk Score</div>
          <div className={`font-medium ${metrics.highestRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
            {metrics.highestRisk}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Time</div>
          <div className="font-medium text-gray-700">{timeStr}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Latency</div>
          <div className="font-medium text-gray-700">{metrics.latencyMs}ms</div>
        </div>
      </div>
    </div>
  );
}
