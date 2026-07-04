"use client";

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { ShieldAlert, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { sparklineData } from './data';

export function DetectionRateCard({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldAlert className="w-16 h-16 text-primary" />
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detection Rate</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-black">99.8%</h2>
        <span className="text-xs text-success font-bold flex items-center">↑ 0.2%</span>
      </div>
      <div className="h-8 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function RequestsSecCard({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Activity className="w-16 h-16 text-primary" />
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Requests / Sec</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-black">2,450</h2>
        <span className="text-xs text-muted-foreground font-bold flex items-center">~ Avg</span>
      </div>
      <div className="h-8 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line type="step" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function ThreatsBlockedCard({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="glass-card p-5 relative overflow-hidden group border-destructive/30 bg-destructive/5">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <AlertTriangle className="w-16 h-16 text-destructive" />
      </div>
      <p className="text-xs font-bold text-destructive uppercase tracking-wider">Threats Blocked</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-black text-destructive">1,204</h2>
        <span className="text-xs text-destructive font-bold flex items-center">↑ 14% (24h)</span>
      </div>
      <div className="h-8 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sparklineData}>
            <Bar dataKey="value" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function AvgRiskScoreCard({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Activity className="w-16 h-16 text-primary" />
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Risk Score</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-black text-warning">42.5</h2>
        <span className="text-xs text-warning font-bold flex items-center">Elevated</span>
      </div>
      <div className="h-8 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
             <Area type="monotone" dataKey="value" stroke="#eab308" fill="#eab308" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
