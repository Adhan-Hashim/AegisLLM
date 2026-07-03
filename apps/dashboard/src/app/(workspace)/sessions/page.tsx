"use client";

import React, { useState, useMemo } from 'react';
import { SessionCatalog } from '@/components/sessions/SessionCatalog';
import { SessionViewer } from '@/components/session-viewer/SessionViewer';
import { ReplaySession } from '@/lib/replay/types';
import { ReplayParser } from '@/lib/replay/parser';

// Mock generation for Session Catalog
function generateMockSessions(): ReplaySession[] {
  const parser = new ReplayParser();
  const sessions: ReplaySession[] = [];
  
  const types = ['Prompt Injection', 'PII', 'SQL', 'Jailbreak', 'XSS', null];
  const decisions = ['ALLOW', 'BLOCK', 'REVIEW', 'REWRITE'];
  
  for (let i = 1; i <= 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const decision = decisions[Math.floor(Math.random() * decisions.length)];
    const riskScore = type ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 25);
    const duration = Math.floor(Math.random() * 800) + 100;
    const timeOffsetMs = Math.floor(Math.random() * 86400000); // within last 24h
    
    const events: any[] = [
      { type: 'start', sessionId: `sess-${i}`, timestamp: new Date(Date.now() - timeOffsetMs).toISOString(), environment: 'production', fingerprint: `hash-${Math.random().toString(36).substring(2,10)}` }
    ];
    
    if (type) {
      events.push({ type: 'finding', timestamp: new Date(Date.now() - timeOffsetMs + duration/2).toISOString(), data: { category: type, riskScore, rule_id: `RULE-${i}` } });
    }
    
    events.push({ type: 'decision', timestamp: new Date(Date.now() - timeOffsetMs + duration).toISOString(), action: decision });
    
    sessions.push(parser.parse(events));
  }
  
  return sessions;
}

export default function SessionsPage() {
  const allSessions = useMemo(() => generateMockSessions(), []);
  const [selectedSession, setSelectedSession] = useState<ReplaySession | null>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Left Pane: Catalog */}
      <div className="w-[450px] flex-shrink-0 border-r z-10 shadow-sm">
        <SessionCatalog 
          sessions={allSessions}
          selectedSessionId={selectedSession?.metadata.id || null}
          onSelectSession={setSelectedSession}
        />
      </div>

      {/* Right Pane: Viewer */}
      <div className="flex-grow flex flex-col bg-gray-50 p-6 overflow-hidden">
        {selectedSession ? (
          <div className="flex-grow shadow-lg rounded-xl overflow-hidden border bg-white flex flex-col h-full">
            <SessionViewer 
              session={selectedSession} 
              replayable={false} // This is the historical viewer, not the active playback center
              developerMode={false} 
            />
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-white m-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No Session Selected</h3>
            <p className="max-w-md text-center text-sm">
              Select a session from the catalog on the left to view its complete timeline, explanation graph, and metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
