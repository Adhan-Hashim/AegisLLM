"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident, mockModels, mockEvents } from './data';

interface LiveEventFeedProps {
  itemVars: any;
  onEventClick: (event: Incident) => void;
  isDrawerOpen: boolean;
}

export function LiveEventFeed({ itemVars, onEventClick, isDrawerOpen }: LiveEventFeedProps) {
  const [feed, setFeed] = useState<Incident[]>([]);
  const [eventId, setEventId] = useState(106);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize with some mock data so it's not empty immediately
  useEffect(() => {
    if (feed.length === 0) {
      const now = new Date();
      setFeed([
        { id: 101, time: getFormattedTime(new Date(now.getTime() - 10000)), model: 'GPT-4.1', rule: 'PI-003', risk: 97, action: 'Blocked', eventName: 'Prompt Injection', severity: 'Critical' },
        { id: 102, time: getFormattedTime(new Date(now.getTime() - 8000)), model: 'Claude 3.5', rule: 'Safe', risk: 12, action: 'Allowed', eventName: 'Safe Request', severity: 'Low' },
        { id: 103, time: getFormattedTime(new Date(now.getTime() - 5000)), model: 'Gemini 1.5', rule: 'SEC-001', risk: 94, action: 'Blocked', eventName: 'Secrets Detection', severity: 'Critical' },
      ]);
    }
  }, []);

  function getFormattedTime(date: Date) {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  }

  useEffect(() => {
    if (isHovered || isDrawerOpen) return;

    const interval = setInterval(() => {
      const randModel = mockModels[Math.floor(Math.random() * mockModels.length)];
      const randEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      
      const newEvent: Incident = {
        id: eventId,
        time: getFormattedTime(new Date()),
        model: randModel,
        ...randEvent,
        risk: randEvent.action === 'Allowed' ? randEvent.risk + Math.floor(Math.random() * 10) : randEvent.risk - Math.floor(Math.random() * 5)
      };

      setFeed(prev => [newEvent, ...prev].slice(0, 8));
      setEventId(prev => prev + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [eventId, isHovered, isDrawerOpen]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertOctagon className="w-3.5 h-3.5 text-destructive" />;
      case 'High': return <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />;
      case 'Medium': return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
      default: return <ShieldCheck className="w-3.5 h-3.5 text-success" />;
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-warning';
      default: return 'bg-success';
    }
  };

  return (
    <motion.div variants={itemVars} className="col-span-8 glass-card p-0 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" /> Live Event Feed
        </h3>
        <div className="flex items-center gap-2">
          {isHovered || isDrawerOpen ? (
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
               PAUSED
            </span>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Listening...</span>
            </>
          )}
        </div>
      </div>
      <div 
        className="overflow-x-auto relative min-h-[360px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Event Type</th>
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold text-center">Risk</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {feed.map((incident) => (
                <motion.tr 
                  key={incident.id}
                  initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onEventClick(incident)}
                  className="border-b border-border/10 hover:bg-secondary/20 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400 whitespace-nowrap">{incident.time}</td>
                  <td className="px-4 py-3 font-semibold text-gray-200">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(incident.severity)}
                      {incident.eventName}
                      {incident.rule !== 'Safe' && (
                        <span className="px-1.5 py-0.5 rounded bg-secondary/50 text-secondary-foreground text-[10px] font-mono">{incident.rule}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{incident.model}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${getSeverityDot(incident.severity)}`}></span>
                      <span className="font-bold text-gray-200">{incident.risk}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${incident.action === 'Blocked' ? 'bg-destructive/10 text-destructive border border-destructive/20' : incident.action === 'Flagged' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'}`}>
                      {incident.action}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
