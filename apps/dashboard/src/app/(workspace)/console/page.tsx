"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { Shield, ShieldAlert, Activity, Cpu, Database, Network, Clock, AlertTriangle, CheckCircle, Zap, Server, ShieldCheck, ChevronRight, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const timelineData = [
  { time: '08:00', allowed: 4200, blocked: 120 },
  { time: '09:00', allowed: 4800, blocked: 450 },
  { time: '10:00', allowed: 5100, blocked: 890 },
  { time: '11:00', allowed: 4900, blocked: 340 },
  { time: '12:00', allowed: 5300, blocked: 1100 },
  { time: '13:00', allowed: 5800, blocked: 400 },
  { time: '14:00', allowed: 6100, blocked: 250 },
  { time: '15:00', allowed: 5900, blocked: 280 },
];

const topThreatsData = [
  { name: 'Prompt Injection', count: 1240, color: '#ef4444' },
  { name: 'Jailbreak', count: 890, color: '#f97316' },
  { name: 'Prompt Leakage', count: 650, color: '#eab308' },
  { name: 'PII/Secrets', count: 420, color: '#3b82f6' },
  { name: 'Toxicity', count: 210, color: '#8b5cf6' },
];

const severityData = [
  { name: 'Critical', value: 340, fill: '#ef4444' },
  { name: 'High', value: 890, fill: '#f97316' },
  { name: 'Medium', value: 1450, fill: '#eab308' },
  { name: 'Low', value: 2100, fill: '#3b82f6' },
];

const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 12 }, { value: 25 }, 
  { value: 40 }, { value: 35 }, { value: 65 }, { value: 85 }, { value: 100 }
];

const initialIncidents = [
  { id: 101, time: '12:44:31', model: 'GPT-4.1', rule: 'PI-003', risk: 97, action: 'Blocked', eventName: 'Prompt Injection' },
  { id: 102, time: '12:44:27', model: 'Claude 3.5', rule: 'Safe', risk: 12, action: 'Allowed', eventName: 'Safe Request' },
  { id: 103, time: '12:44:22', model: 'Gemini 1.5', rule: 'SEC-001', risk: 94, action: 'Blocked', eventName: 'Secrets Detection' },
  { id: 104, time: '12:44:19', model: 'GPT-4.1', rule: 'JB-002', risk: 91, action: 'Blocked', eventName: 'Jailbreak Attempt' },
  { id: 105, time: '12:43:55', model: 'Llama 3', rule: 'TOX-004', risk: 75, action: 'Flagged', eventName: 'Toxicity' },
];

const mockModels = ['GPT-4.1', 'Claude 3.5', 'Gemini 1.5 Pro', 'Llama 3', 'DeepSeek Coder'];
const mockEvents = [
  { rule: 'PI-003', risk: 99, action: 'Blocked', eventName: 'Prompt Injection' },
  { rule: 'SEC-001', risk: 95, action: 'Blocked', eventName: 'Secrets Detection' },
  { rule: 'JB-002', risk: 92, action: 'Blocked', eventName: 'Jailbreak Attempt' },
  { rule: 'Safe', risk: 5, action: 'Allowed', eventName: 'Safe Request' },
  { rule: 'Safe', risk: 15, action: 'Allowed', eventName: 'Safe Request' },
  { rule: 'Safe', risk: 8, action: 'Allowed', eventName: 'Safe Request' },
  { rule: 'TOX-004', risk: 78, action: 'Flagged', eventName: 'Toxicity' },
  { rule: 'LEAK-01', risk: 85, action: 'Blocked', eventName: 'Prompt Leakage' },
];

export default function SecurityConsole() {
  const [feed, setFeed] = useState(initialIncidents);
  const [eventId, setEventId] = useState(106);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const randModel = mockModels[Math.floor(Math.random() * mockModels.length)];
      const randEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      
      const newEvent = {
        id: eventId,
        time: timeStr,
        model: randModel,
        ...randEvent,
        risk: randEvent.action === 'Allowed' ? randEvent.risk + Math.floor(Math.random() * 10) : randEvent.risk - Math.floor(Math.random() * 5)
      };

      setFeed(prev => [newEvent, ...prev].slice(0, 5));
      setEventId(prev => prev + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [eventId]);

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

      <div className="flex-1 overflow-y-auto p-8">
        <motion.div 
          className="max-w-[1600px] mx-auto flex flex-col gap-6"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-5 gap-6">
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
          </div>

          <div className="grid grid-cols-12 gap-6">
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
          </div>

          <div className="grid grid-cols-12 gap-6">
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

            <motion.div variants={itemVars} className="col-span-4 glass-card p-5 flex flex-col">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Active Policies
              </h3>
              <div className="flex-1 grid grid-cols-2 gap-2 content-start">
                {[
                  'Prompt Injection', 'Jailbreak', 'PII', 'Toxicity', 
                  'Secrets', 'Code Execution', 'Prompt Leakage', 'Hallucination'
                ].map((policy) => (
                  <div key={policy} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/30">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-gray-300">{policy}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-8">
            <motion.div variants={itemVars} className="col-span-8 glass-card p-0 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Live Event Feed
                </h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-mono text-primary uppercase tracking-widest">Listening...</span>
                </div>
              </div>
              <div className="overflow-x-auto relative min-h-[260px]">
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
                          initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                          animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.4 }}
                          className="border-b border-border/20 hover:bg-secondary/10 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{incident.time}</td>
                          <td className="px-4 py-3 font-semibold text-gray-200">
                            {incident.eventName}
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-secondary/50 text-secondary-foreground text-[10px] font-mono">{incident.rule}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{incident.model}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold ${incident.risk >= 90 ? 'text-destructive' : incident.risk >= 70 ? 'text-warning' : 'text-success'}`}>{incident.risk}</span>
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

            <motion.div variants={itemVars} className="col-span-4 glass-card p-5 flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Network className="w-4 h-4" /> Protected Models
              </h3>
              <div className="flex-1 space-y-4">
                {[
                  { name: 'OpenAI GPT-4o', value: '99.9%' },
                  { name: 'Anthropic Claude 3.5', value: '99.7%' },
                  { name: 'Google Gemini 1.5 Pro', value: '100%' },
                  { name: 'DeepSeek Coder', value: '99.8%' },
                  { name: 'Meta Llama 3', value: '98.9%' },
                ].map((model) => (
                  <div key={model.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/50 transition-colors">
                    <span className="text-sm font-semibold text-gray-200">{model.name}</span>
                    <span className="text-sm font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">{model.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}
