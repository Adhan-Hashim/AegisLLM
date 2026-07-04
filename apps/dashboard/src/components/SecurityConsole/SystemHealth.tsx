"use client";

import React from 'react';
import { Server, Network, Cpu, Shield, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function SystemHealth({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="col-span-3 glass-card p-5 flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Server className="w-4 h-4" /> System Health
      </h3>
      <div className="space-y-3 flex-1">
        {[
          { name: 'Gateway', icon: Network },
          { name: 'Detection Engine', icon: Cpu },
          { name: 'Policy Engine', icon: Shield },
          { name: 'Redis Cache', icon: Database },
          { name: 'LLM Proxy', icon: Zap },
        ].map((sys, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2 text-gray-300">
              <sys.icon className="w-4 h-4 text-gray-500" /> {sys.name}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-success">
              <span className="w-2 h-2 rounded-full bg-success"></span> Healthy
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
