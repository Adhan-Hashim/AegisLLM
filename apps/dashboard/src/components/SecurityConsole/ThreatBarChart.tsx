"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { topThreatsData } from './data';

export function ThreatBarChart({ itemVars }: { itemVars: any }) {
  return (
    <motion.div variants={itemVars} className="col-span-4 glass-card p-5 flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Target className="w-4 h-4" /> Top Threats
      </h3>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topThreatsData} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} width={100} />
            <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
              {topThreatsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
