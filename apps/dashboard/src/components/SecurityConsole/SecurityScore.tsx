"use client";

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { sparklineData } from './data';

export function SecurityScore({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="glass-card p-5 relative overflow-hidden group border-primary/30 bg-primary/5">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Target className="w-16 h-16 text-primary" />
      </div>
      <p className="text-xs font-bold text-primary uppercase tracking-wider">Security Score</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-black text-primary">98<span className="text-xl text-muted-foreground">/100</span></h2>
        <span className="text-xs text-success font-bold flex items-center">Excellent (↑ 2.4%)</span>
      </div>
      <div className="h-8 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
             <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
