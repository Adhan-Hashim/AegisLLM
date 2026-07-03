"use client";

import { useState } from "react";
import { useAttackLabStore } from "@/store/attackLab";
import { streamService } from "@/services/stream";
import { API_BASE_URL } from "@/services/api";
import { Play, Box, CheckCircle, Activity, Clock, Server, Copy, Download, Link2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExplainabilityGraph } from "@/components/explainability/ExplainabilityGraph";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { DiagnosticsPanel } from "@/components/inspector/DiagnosticsPanel";

export default function AttackLabPage() {
  const [prompt, setPrompt] = useState("");
  const { events, isRunning, riskScore, decision, findings, setRunning, addEvent, setFinalState, reset, setInspectorData } = useAttackLabStore();

  const handleRunAttack = () => {
    if (!prompt.trim()) return;
    
    reset();
    setRunning(true);
    
    streamService.connect(
      `${API_BASE_URL}/analyze/stream`,
      { prompt, metadata: { source: "attack-lab" } },
      (msg) => {
        addEvent(msg);
        
        if (msg.event === "AnalysisComplete") {
          const finalData = msg.data;
          setFinalState(
            finalData.decision, 
            finalData.risk?.score || 0, 
            finalData.timeline || [], 
            finalData.findings || []
          );
        }
      },
      (err) => {
        console.error("Stream error:", err);
        setRunning(false);
      }
    );
  };

  const getEventColor = (eventName: string) => {
    switch (eventName) {
      case "PromptReceived": return "text-muted-foreground";
      case "PromptNormalized": return "text-blue-500";
      case "DetectorExecuted": return "text-cyan-500";
      case "FindingCreated": return "text-orange-500";
      case "RiskCalculated": return "text-purple-500";
      case "AnalysisComplete": return decision?.action === 'BLOCK' ? 'text-destructive' : 'text-success';
      default: return "text-primary";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Header & Live Pipeline Health */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Attack Lab: Investigation Workspace</h1>
        </div>
        
        {/* Live Pipeline Health */}
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> API: Healthy</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Engine: Running</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Streaming: Connected</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Audit: Active</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 min-h-0 overflow-y-auto">
        
        {/* Payload Input & Session Summary Row */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 glass-card p-4 flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Box className="w-3 h-3" /> Payload
            </label>
            <textarea 
              className="w-full bg-background border border-border rounded p-3 text-sm font-mono h-24 resize-none outline-none focus:ring-1 focus:ring-primary"
              placeholder="Inject payload..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
            />
            <button 
              onClick={handleRunAttack}
              disabled={isRunning || !prompt.trim()}
              className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Evaluating..." : "Run Attack"}
            </button>
          </div>

          <div className="col-span-8 flex flex-col gap-6">
            
            {/* Threat Intelligence Card */}
            {decision && findings.length > 0 && (
              <div className="glass-card p-4 border border-destructive/30 bg-destructive/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-destructive flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Threat Intelligence</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Threat</span>
                    <span className="font-semibold text-sm">{findings[0]?.category || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Severity</span>
                    <span className="font-semibold text-sm text-destructive">{findings[0]?.severity || "High"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Confidence</span>
                    <span className="font-semibold text-sm">{(findings[0]?.confidence * 100 || 98.4).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Recommendation</span>
                    <span className="font-semibold text-sm">{findings[0]?.recommendation || "Block Request"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Session Summary Card */}
            <div className="glass-card p-4 flex flex-col justify-between flex-1">
              {decision ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">Session Summary</h2>
                      <p className="text-xs text-muted-foreground font-mono mt-1">Fingerprint: PI-275eca10</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded border border-border/50 hover:bg-secondary/80 flex items-center gap-1"><Copy className="w-3 h-3" /> JSON</button>
                      <button className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded border border-border/50 hover:bg-secondary/80 flex items-center gap-1"><Terminal className="w-3 h-3" /> cURL</button>
                      <button className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded border border-border/50 hover:bg-secondary/80 flex items-center gap-1"><Download className="w-3 h-3" /> Report</button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    <div className="flex flex-col items-center justify-center border-r border-border/50">
                      <span className="text-xs text-muted-foreground uppercase mb-1">Decision</span>
                      <span className={`font-bold text-lg ${decision.action === 'BLOCK' ? 'text-destructive' : 'text-success'}`}>{decision.action}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-border/50">
                      <span className="text-xs text-muted-foreground uppercase mb-1">Risk</span>
                      <div className="relative w-12 h-12 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-secondary stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className={`${riskScore > 50 ? 'text-destructive' : 'text-success'} stroke-current`} strokeDasharray={`${riskScore}, 100`} strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                         </svg>
                         <span className="absolute text-sm font-bold">{riskScore}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-border/50">
                      <span className="text-xs text-muted-foreground uppercase mb-1">Rules</span>
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-border/50">
                      <span className="text-xs text-muted-foreground uppercase mb-1">Findings</span>
                      <span className="font-bold text-lg">{findings.length}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs text-muted-foreground uppercase mb-1">Latency</span>
                      <span className="font-bold text-lg font-mono">13 ms</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Awaiting attack evaluation...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3-Panel SOC Layout */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-[400px]">
          
          {/* Timeline Panel */}
          <div className="col-span-3 glass-card flex flex-col overflow-hidden">
            <div className="bg-secondary/50 border-b border-border/50 px-4 py-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Timeline</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {events.map((ev, i) => (
                <div 
                  key={i} 
                  onClick={() => setInspectorData('event', i, { title: ev.event, raw: ev.data })}
                  className="p-3 rounded bg-background border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${getEventColor(ev.event)}`}>{ev.event}</span>
                    <CheckCircle className="w-3 h-3 text-success opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability Graph Panel */}
          <div className="col-span-6 glass-card flex flex-col overflow-hidden">
            <div className="bg-secondary/50 border-b border-border/50 px-4 py-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Link2 className="w-4 h-4" /> Explainability Graph</h3>
            </div>
            <div className="flex-1 bg-background/50 relative">
              <ExplainabilityGraph />
            </div>
          </div>

          {/* Persistent Inspector Panel */}
          <div className="col-span-3 flex flex-col gap-6">
            <div className="flex-1 min-h-0">
               <InspectorPanel />
            </div>
          </div>
          
        </div>

        {/* Developer Console / Diagnostics at the bottom */}
        <div className="h-[300px]">
          <DiagnosticsPanel />
        </div>

      </div>
    </div>
  );
}

// Temporary icon imports needed due to inline addition
import { Terminal } from "lucide-react";
