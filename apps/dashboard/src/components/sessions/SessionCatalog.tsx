"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ReplaySession } from '../../lib/replay/types';
import { SessionCard } from './SessionCard';
import { SearchX } from 'lucide-react';

interface SessionCatalogProps {
  sessions: ReplaySession[];
  selectedSessionId: string | null;
  onSelectSession: (session: ReplaySession) => void;
}

export function SessionCatalog({ sessions, selectedSessionId, onSelectSession }: SessionCatalogProps) {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  
  // Local storage for pinned sessions
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aegis_pinned_sessions');
      if (stored) setPinnedIds(new Set(JSON.parse(stored)));
    } catch (e) {
      // ignore
    }
  }, []);

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent card selection
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('aegis_pinned_sessions', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // 1. Search Filter (Fingerprint, Rule IDs, Findings, Categories)
      if (search) {
        const q = search.toLowerCase();
        const matchesFingerprint = session.fingerprint.toLowerCase().includes(q);
        const matchesFindings = session.findings.some(f => 
          f.data?.category?.toLowerCase().includes(q) || 
          f.data?.rule_id?.toLowerCase().includes(q) ||
          JSON.stringify(f).toLowerCase().includes(q)
        );
        if (!matchesFingerprint && !matchesFindings) return false;
      }

      // 2. Decision Filter
      if (decisionFilter !== 'ALL' && session.decision?.action !== decisionFilter) {
        return false;
      }

      // 3. Risk Filter
      if (riskFilter !== 'ALL') {
        const risk = session.metrics.highestRisk;
        if (riskFilter === '0-25' && risk > 25) return false;
        if (riskFilter === '26-50' && (risk < 26 || risk > 50)) return false;
        if (riskFilter === '51-75' && (risk < 51 || risk > 75)) return false;
        if (riskFilter === '76-100' && risk < 76) return false;
      }

      // 4. Type Filter
      if (typeFilter !== 'ALL') {
        const primaryCategory = session.findings.length > 0 ? session.findings[0].data?.category : 'Safe';
        if (primaryCategory !== typeFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort pinned first, then by timestamp descending
      const aPinned = pinnedIds.has(a.metadata.id);
      const bPinned = pinnedIds.has(b.metadata.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime();
    });
  }, [sessions, search, decisionFilter, riskFilter, typeFilter, pinnedIds]);

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r">
      <div className="p-4 border-b space-y-4 bg-white">
        <h2 className="text-xl font-bold text-gray-900">Session Catalog</h2>
        
        {/* Search */}
        <div>
          <input 
            type="text" 
            placeholder="Search fingerprints, rules, categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-2">
          <select 
            value={decisionFilter} 
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50"
          >
            <option value="ALL">All Decisions</option>
            <option value="ALLOW">Allow</option>
            <option value="BLOCK">Block</option>
            <option value="REVIEW">Review</option>
            <option value="REWRITE">Rewrite</option>
          </select>

          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50"
          >
            <option value="ALL">All Risks</option>
            <option value="0-25">0–25</option>
            <option value="26-50">26–50</option>
            <option value="51-75">51–75</option>
            <option value="76-100">76–100</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50"
          >
            <option value="ALL">All Attacks</option>
            <option value="Prompt Injection">Prompt Injection</option>
            <option value="PII">PII</option>
            <option value="SQL">SQL</option>
            <option value="XSS">XSS</option>
            <option value="Jailbreak">Jailbreak</option>
            <option value="Safe">Safe (No Finding)</option>
          </select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-16 gap-3">
            <SearchX className="w-12 h-12 text-gray-300" />
            <p className="text-sm font-medium">No sessions found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <SessionCard 
              key={session.metadata.id}
              session={session}
              isSelected={selectedSessionId === session.metadata.id}
              isPinned={pinnedIds.has(session.metadata.id)}
              onSelect={onSelectSession}
              onTogglePin={togglePin}
            />
          ))
        )}
      </div>
    </div>
  );
}
