"use client";

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { SecurityScore } from '@/components/SecurityConsole/SecurityScore';
import { DetectionRateCard, RequestsSecCard, ThreatsBlockedCard, AvgRiskScoreCard } from '@/components/SecurityConsole/KPICards';
import { SystemHealth } from '@/components/SecurityConsole/SystemHealth';
import { ThreatTimelineChart } from '@/components/SecurityConsole/ThreatTimelineChart';
import { ThreatBarChart } from '@/components/SecurityConsole/ThreatBarChart';
import { SeverityBreakdown } from '@/components/SecurityConsole/SeverityBreakdown';
import { ActivePolicies } from '@/components/SecurityConsole/ActivePolicies';
import { LiveEventFeed } from '@/components/SecurityConsole/LiveEventFeed';
import { ProtectedModels } from '@/components/SecurityConsole/ProtectedModels';
import { InvestigationDrawer } from '@/components/SecurityConsole/InvestigationDrawer';
import { Incident } from '@/components/SecurityConsole/data';

export default function SecurityConsole() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Security Operations Center</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            AegisLLM Enterprise <ChevronRight className="w-3 h-3" /> Global View
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-success/10 border border-success/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm font-bold text-success tracking-wide uppercase">Threat Level: Low</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative">
        <motion.div 
          className="max-w-[1600px] mx-auto flex flex-col gap-6"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          {/* Top KPI Cards */}
          <div className="grid grid-cols-5 gap-6">
            <SecurityScore itemVars={itemVars} />
            <DetectionRateCard itemVars={itemVars} />
            <RequestsSecCard itemVars={itemVars} />
            <ThreatsBlockedCard itemVars={itemVars} />
            <AvgRiskScoreCard itemVars={itemVars} />
          </div>

          {/* System Status & Policies Row */}
          <div className="grid grid-cols-12 gap-6">
            <SystemHealth itemVars={itemVars} />
            <ThreatTimelineChart itemVars={itemVars} />
          </div>

          {/* Detailed Analytics Row */}
          <div className="grid grid-cols-12 gap-6">
            <ThreatBarChart itemVars={itemVars} />
            <SeverityBreakdown itemVars={itemVars} />
            <ActivePolicies itemVars={itemVars} />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-12 gap-6 pb-8">
            <LiveEventFeed 
              itemVars={itemVars} 
              onEventClick={(incident) => setSelectedIncident(incident)} 
              isDrawerOpen={selectedIncident !== null}
            />
            <ProtectedModels itemVars={itemVars} />
          </div>
        </motion.div>
      </div>

      <InvestigationDrawer 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />
    </div>
  );
}
