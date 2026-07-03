import React from 'react';
import { InspectableItem } from '../../lib/replay/types';

interface InspectorProps {
  item: InspectableItem | null;
  developerMode?: boolean;
}

export function Inspector({ item, developerMode }: InspectorProps) {
  if (!item) {
    return (
      <div className="p-4 text-gray-500 text-sm text-center italic h-full flex items-center justify-center">
        Select an item in the graph or timeline to inspect it.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {item.type.replace('_', ' ')}
        </span>
        <span className="text-xs font-mono text-gray-400 truncate max-w-[150px]">
          {item.id}
        </span>
      </div>
      
      <div className="p-4 overflow-y-auto">
        <h3 className="font-medium text-lg mb-4">{item.title}</h3>
        
        <div className="space-y-4">
          {/* We would render specific property panels based on item.type here */}
          
          {developerMode && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Raw Payload</h4>
              <pre className="bg-gray-800 text-gray-300 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(item.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
