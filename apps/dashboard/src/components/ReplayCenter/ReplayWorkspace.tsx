"use client";

import React, { useState } from 'react';
import { Play, RotateCcw, ShieldAlert, ShieldCheck, ArrowRight, Code, Zap, CheckCircle, Activity, AlertOctagon } from 'lucide-react';
import { ReplayEvent } from './data';
import { motion, AnimatePresence } from 'framer-motion';

interface ReplayWorkspaceProps {
  event: ReplayEvent;
}

export function ReplayWorkspace({ event }: ReplayWorkspaceProps) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayComplete, setReplayComplete] = useState(false);

  const handleReplay = () => {
    setIsReplaying(true);
    setReplayComplete(false);
    
    // Simulate network delay and execution time
    setTimeout(() => {
      setIsReplaying(false);
      setReplayComplete(true);
    }, 1500);
  };

  const getActionColor = (action: string) => {
    if (action === 'Blocked') return 'text-destructive';
    if (action === 'Flagged') return 'text-warning';
    return 'text-success';
  };

  // The simulated replay result (always achieving the expected outcome for demo purposes)
  const simulatedResult = {
    action: event.expectedOutcome,
    riskScore: event.expectedOutcome === 'Blocked' ? 98 : 12,
    latency: 18,
    matchedRules: event.expectedOutcome === 'Blocked' ? ['PI-003', 'Toxicity'] : []
  };

  const ExecutionTrace = ({ isHistorical, result }: { isHistorical: boolean, result: any }) => (
    <div className="relative pl-4 space-y-0 mt-6">
      <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border/50" />
      {[
        { title: 'Gateway Received', icon: Activity, color: 'text-gray-400' },
        { title: 'Policy Engine Evaluation', icon: Zap, color: 'text-primary' },
        ...(result.matchedRules.length > 0 ? [{ title: `${result.matchedRules.join(', ')} Triggered`, icon: ShieldAlert, color: 'text-warning' }] : []),
        { title: `Decision: ${result.action}`, icon: result.action === 'Blocked' ? AlertOctagon : CheckCircle, color: getActionColor(result.action) },
      ].map((step, idx) => (
        <div key={idx} className="relative flex gap-6 pb-6 last:pb-0">
          <div className={`w-8 h-8 rounded-full bg-background border-2 border-border/50 flex items-center justify-center z-10 ${step.color}`}>
            <step.icon className="w-4 h-4" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-gray-200">{step.title}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-background/50 overflow-hidden relative">
      {/* Header Controls */}
      <div className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            Replay Analysis: {event.id}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Tenant: {event.tenant} • Model: {event.model}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setReplayComplete(false)}
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white bg-secondary/30 hover:bg-secondary/50 rounded-lg flex items-center gap-2 transition-colors border border-border/50"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleReplay}
            disabled={isReplaying}
            className="px-6 py-2 text-sm font-bold text-black bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {isReplaying ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
            ) : (
              <Play className="w-4 h-4 fill-black" />
            )}
            Run Replay
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Payload Section */}
          <div className="glass-card p-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" /> Original Payload
            </h3>
            <div className="p-4 rounded-lg bg-[#0a0a0c] border border-border/30 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {event.prompt}
            </div>
          </div>

          {/* Comparison Area */}
          <div className="grid grid-cols-2 gap-8 relative">
            {/* Historical Execution */}
            <div className="glass-card p-6 border-border/30 relative opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-secondary rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
                Historical Execution
              </div>
              
              <div className="mt-4 flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/20 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Final Decision</p>
                  <p className={`text-2xl font-black uppercase tracking-wider ${getActionColor(event.historicalResult.action)}`}>
                    {event.historicalResult.action}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Risk</p>
                  <p className="text-2xl font-black text-white">{event.historicalResult.riskScore}</p>
                </div>
              </div>

              <ExecutionTrace isHistorical={true} result={event.historicalResult} />
            </div>

            {/* Visual Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground shadow-xl hidden md:flex">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Replay Execution */}
            <div className="glass-card p-6 border-primary/20 relative bg-primary/5 min-h-[400px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-black rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                Current Policy Replay
              </div>

              <AnimatePresence mode="wait">
                {!replayComplete && !isReplaying && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 mt-20"
                  >
                    <RotateCcw className="w-12 h-12 opacity-20" />
                    <p className="font-mono text-sm">Waiting for replay execution...</p>
                  </motion.div>
                )}

                {isReplaying && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-primary gap-4 mt-20"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <Activity className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="font-mono text-sm animate-pulse tracking-widest uppercase">Evaluating Policies</p>
                  </motion.div>
                )}

                {replayComplete && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mt-4 flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/30 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                      <div>
                        <p className="text-xs text-primary/80 uppercase tracking-wider font-bold mb-1">Final Decision</p>
                        <p className={`text-2xl font-black uppercase tracking-wider ${getActionColor(simulatedResult.action)}`}>
                          {simulatedResult.action}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary/80 uppercase tracking-wider font-bold mb-1">Risk</p>
                        <p className="text-2xl font-black text-white">{simulatedResult.riskScore}</p>
                      </div>
                    </div>

                    <ExecutionTrace isHistorical={false} result={simulatedResult} />
                    
                    {simulatedResult.action !== event.historicalResult.action && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-6 p-4 rounded-lg bg-success/10 border border-success/30 flex items-start gap-3"
                      >
                        <ShieldCheck className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-success mb-1">Policy Update Successful</h4>
                          <p className="text-xs text-gray-300">
                            Current policies successfully mitigated this {event.category.toLowerCase()}. The threat would now be properly handled.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
