"use client";

import React, { useState } from 'react';
import { SessionViewer } from '@/components/session-viewer/SessionViewer';
import { ReplaySession } from '@/lib/replay/types';
import { ReplayParser } from '@/lib/replay/parser';

// A mock JSONL-style event log
const MOCK_RAW_EVENTS = [
  { type: 'start', sessionId: 'mock-1', timestamp: new Date(Date.now() - 5000).toISOString(), environment: 'staging', fingerprint: 'hash-abc' },
  { type: 'normalizer', timestamp: new Date(Date.now() - 4000).toISOString(), data: { normalized: true } },
  { type: 'finding', timestamp: new Date(Date.now() - 3000).toISOString(), data: { category: 'Prompt Injection', riskScore: 42, rule_id: 'PI-001' } },
  { type: 'finding', timestamp: new Date(Date.now() - 2000).toISOString(), data: { category: 'Jailbreak', riskScore: 88, rule_id: 'JB-002' } },
  { type: 'decision', timestamp: new Date(Date.now() - 1000).toISOString(), action: 'BLOCK' }
];

export default function ReplayCenterPage() {
  const [session] = useState<ReplaySession>(() => {
    const parser = new ReplayParser();
    return parser.parse(MOCK_RAW_EVENTS);
  });

  const [decisionAnimation, setDecisionAnimation] = useState(false);

  const handleReplayComplete = () => {
    // 250-350ms animation trigger for polish
    setDecisionAnimation(true);
    setTimeout(() => setDecisionAnimation(false), 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Replay Center</h1>
          <p className="text-gray-500">Forensic playback of intercepted events.</p>
        </div>
      </div>

      <div className={`flex-grow transition-all duration-300 ${decisionAnimation ? 'ring-4 ring-red-500/50 shadow-xl shadow-red-500/20' : ''}`}>
        <SessionViewer 
          session={session} 
          replayable 
          developerMode 
          onReplayComplete={handleReplayComplete}
        />
      </div>
    </div>
  );
}
