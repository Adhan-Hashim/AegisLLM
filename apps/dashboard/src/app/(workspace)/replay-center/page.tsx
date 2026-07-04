"use client";

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { EventBrowser } from '@/components/ReplayCenter/EventBrowser';
import { ReplayWorkspace } from '@/components/ReplayCenter/ReplayWorkspace';
import { mockReplayEvents, ReplayEvent } from '@/components/ReplayCenter/data';

export default function ReplayCenterPage() {
  const [selectedEvent, setSelectedEvent] = useState<ReplayEvent | null>(mockReplayEvents[0]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Replay Center</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            AegisLLM Enterprise <ChevronRight className="w-3 h-3" /> Historical Analysis
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <EventBrowser 
          events={mockReplayEvents}
          selectedId={selectedEvent?.id || null}
          onSelect={setSelectedEvent}
        />
        
        {selectedEvent ? (
          <ReplayWorkspace event={selectedEvent} key={selectedEvent.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select an event to analyze
          </div>
        )}
      </div>
    </div>
  );
}
