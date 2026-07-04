"use client";

import React from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import { ReplayEvent } from './data';
import { motion } from 'framer-motion';

interface EventBrowserProps {
  events: ReplayEvent[];
  selectedId: string | null;
  onSelect: (event: ReplayEvent) => void;
}

export function EventBrowser({ events, selectedId, onSelect }: EventBrowserProps) {
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'False Negative': return <ShieldAlert className="w-4 h-4 text-destructive" />;
      case 'False Positive': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <ShieldCheck className="w-4 h-4 text-success" />;
    }
  };

  return (
    <div className="w-80 h-full border-r border-border/50 bg-card/30 flex flex-col backdrop-blur-md">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Historical Events
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full bg-background/50 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelect(event)}
            className={`w-full text-left p-4 border-b border-border/10 transition-colors relative group ${selectedId === event.id ? 'bg-primary/10' : 'hover:bg-secondary/30'}`}
          >
            {selectedId === event.id && (
              <motion.div layoutId="active-event" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono font-bold text-gray-300">{event.id}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{event.timestamp.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(event.category)}
              <span className="text-sm font-semibold text-gray-200">{event.category}</span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {event.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
