"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineData } from './data';

export function ThreatTimelineChart({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="col-span-9 glass-card p-5 flex flex-col">
       <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Threat Timeline (24h)
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="allowed" name="Allowed Requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAllowed)" />
            <Area type="monotone" dataKey="blocked" name="Blocked Threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
