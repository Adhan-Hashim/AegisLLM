"use client";

import { useAttackLabStore } from "@/store/attackLab";
import { useState } from "react";
import { Activity, Clock, FileJson, Server, AlignLeft, ShieldCheck } from "lucide-react";

type Tab = 'events' | 'metrics' | 'context' | 'api' | 'headers';

export function DiagnosticsPanel() {
  const { events, decision, riskScore, timeline, findings } = useAttackLabStore();
  const [activeTab, setActiveTab] = useState<Tab>('metrics');

  const finalResponse = {
    decision,
    risk: { score: riskScore },
    timeline,
    findings,
  };

  return (
    <div className="w-full h-full flex flex-col bg-card border border-border/50 rounded-lg overflow-hidden">
      {/* Dev Console Header / Tabs */}
      <div className="flex items-center gap-1 bg-secondary/50 border-b border-border/50 px-2 pt-2">
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-md flex items-center gap-2 ${activeTab === 'metrics' ? 'bg-card text-primary border border-b-0 border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Clock className="w-3 h-3" /> Metrics
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-md flex items-center gap-2 ${activeTab === 'events' ? 'bg-card text-primary border border-b-0 border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Activity className="w-3 h-3" /> Raw Events
        </button>
        <button 
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-md flex items-center gap-2 ${activeTab === 'api' ? 'bg-card text-primary border border-b-0 border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <FileJson className="w-3 h-3" /> Final API Response
        </button>
        <button 
          onClick={() => setActiveTab('context')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-md flex items-center gap-2 ${activeTab === 'context' ? 'bg-card text-primary border border-b-0 border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <ShieldCheck className="w-3 h-3" /> Context
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold mb-2">Latency Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border/50 rounded flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Pipeline Time</span>
                <span className="font-mono text-sm">13.2 ms</span>
              </div>
              <div className="p-3 border border-border/50 rounded flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Normalization</span>
                <span className="font-mono text-sm">1.2 ms</span>
              </div>
              <div className="p-3 border border-border/50 rounded flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Detection</span>
                <span className="font-mono text-sm">5.8 ms</span>
              </div>
              <div className="p-3 border border-border/50 rounded flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Aggregation</span>
                <span className="font-mono text-sm">0.4 ms</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">* Note: Latency breakdown is mocked for v1.0 frontend until API implements OpenTelemetry traces.</p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-2">
            {events.map((ev, i) => (
              <div key={i} className="text-xs border-b border-border/50 pb-2 mb-2">
                <span className="text-primary font-bold">{ev.event}</span>
                <pre className="mt-1 text-muted-foreground">{JSON.stringify(ev.data, null, 2)}</pre>
              </div>
            ))}
            {events.length === 0 && <span className="text-muted-foreground text-sm">No events recorded.</span>}
          </div>
        )}

        {activeTab === 'api' && (
          <pre className="text-xs font-mono text-muted-foreground">
            {decision ? JSON.stringify(finalResponse, null, 2) : "Awaiting final evaluation..."}
          </pre>
        )}

        {activeTab === 'context' && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Environment:</strong> Production (Simulated)</p>
            <p><strong>Active Detectors:</strong> PromptInjectionDetector</p>
            <p><strong>Streaming Strategy:</strong> Server-Sent Events (fetch implementation)</p>
          </div>
        )}
      </div>
    </div>
  );
}
