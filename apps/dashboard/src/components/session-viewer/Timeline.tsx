import React from 'react';
import { TimelineModel, TimelineState } from '../../lib/replay/types';

interface TimelineProps {
  model: TimelineModel;
  onSelect?: (id: string, item: any) => void;
  selectedId?: string | null;
}

export function Timeline({ model, onSelect, selectedId }: TimelineProps) {
  if (model.items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 italic">
        No timeline events.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-2">
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
        {model.items.map((item) => {
          const isSelected = selectedId === item.id;
          
          let stateColor = 'bg-gray-300'; // FUTURE
          if (item.state === TimelineState.ACTIVE) stateColor = 'bg-blue-500 ring-4 ring-blue-100';
          else if (item.state === TimelineState.COMPLETE) stateColor = 'bg-green-500';

          return (
            <div 
              key={item.id} 
              className={`relative pl-6 cursor-pointer group ${isSelected ? 'bg-blue-50/50 rounded-r' : ''}`}
              onClick={() => onSelect?.(item.id, item)}
            >
              {/* Dot */}
              <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${stateColor} border-2 border-white`} />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-gray-500">{item.timestampMs}ms</span>
                  <h4 className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {item.label}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
