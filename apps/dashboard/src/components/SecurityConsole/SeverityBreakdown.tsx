"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { severityData } from './data';

export function SeverityBreakdown({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="col-span-4 glass-card p-5 flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> Severity Breakdown
      </h3>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {severityData.map((sev) => {
          const max = Math.max(...severityData.map(s => s.value));
          const percentage = (sev.value / max) * 100;
          return (
            <div key={sev.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-300">{sev.name}</span>
                <span className="text-muted-foreground font-mono">{sev.value}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full" 
                  style={{ backgroundColor: sev.fill }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
