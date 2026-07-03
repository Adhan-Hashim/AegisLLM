"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { FileText, Folder, FolderOpen, Search, ChevronRight, ChevronDown, AlertCircle, FileCode2 } from "lucide-react";

export interface RuleFile {
  id: string;
  name: string;
  category: string;
  content: string;
}

export interface RuleExplorerProps {
  onSelectRule: (rule: RuleFile) => void;
  activeRuleId?: string;
}

// Mock Data
const MOCK_RULES: RuleFile[] = [
  { id: "pi-001", name: "prompt_injection.yaml", category: "Prompt Injection", content: "id: PI-001\n..." },
  { id: "pi-002", name: "jailbreak.yaml", category: "Prompt Injection", content: "id: PI-002\n..." },
  { id: "pii-001", name: "ssn.yaml", category: "PII", content: "id: PII-001\n..." },
  { id: "pii-002", name: "credit_card.yaml", category: "PII", content: "id: PII-002\n..." },
  { id: "sql-001", name: "union_select.yaml", category: "SQL Injection", content: "id: SQL-001\n..." },
  { id: "xss-001", name: "script_tags.yaml", category: "XSS", content: "id: XSS-001\n..." },
];

type Status = "loading" | "error" | "success" | "empty";

export function RuleExplorer({ onSelectRule, activeRuleId }: RuleExplorerProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [rules, setRules] = useState<RuleFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Prompt Injection"]));
  
  // Keyboard nav state
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setRules(MOCK_RULES);
      setStatus(MOCK_RULES.length > 0 ? "success" : "empty");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (category: string) => {
    const next = new Set(expandedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setExpandedCategories(next);
  };

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(filteredRules.map(r => r.category))).sort();
  
  // Flatten list for keyboard navigation
  const visibleItems: { type: 'category' | 'file'; id: string; category: string; rule?: RuleFile }[] = [];
  categories.forEach(category => {
    visibleItems.push({ type: 'category', id: `cat-${category}`, category });
    if (expandedCategories.has(category)) {
      const categoryRules = filteredRules.filter(r => r.category === category);
      categoryRules.forEach(rule => {
        visibleItems.push({ type: 'file', id: rule.id, category, rule });
      });
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (status !== "success" || visibleItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < visibleItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const item = visibleItems[focusedIndex];
      if (item.type === 'category') {
        toggleCategory(item.category);
      } else if (item.type === 'file' && item.rule) {
        onSelectRule(item.rule);
      }
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="flex flex-col h-full bg-card/30" onKeyDown={handleKeyDown} tabIndex={-1} ref={containerRef}>
      {/* Search Header */}
      <div className="p-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search rules..." 
            className="w-full bg-background border border-border/50 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-70">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-3"></div>
            <span className="text-sm">Loading rules...</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
            <span className="text-sm font-semibold">Failed to load rules</span>
            <button onClick={() => setStatus("loading")} className="mt-4 px-3 py-1 bg-secondary text-xs rounded hover:bg-secondary/80">Retry</button>
          </div>
        )}

        {status === "empty" && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileCode2 className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">No rules found</span>
          </div>
        )}

        {status === "success" && visibleItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <span className="text-sm">No matches for "{searchQuery}"</span>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-0.5 outline-none">
            {visibleItems.map((item, index) => {
              if (item.type === 'category') {
                const isExpanded = expandedCategories.has(item.category);
                return (
                  <div 
                    key={item.id}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    tabIndex={0}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer select-none text-sm font-medium ${focusedIndex === index ? 'ring-1 ring-primary/50 bg-secondary/50' : 'hover:bg-secondary/30'}`}
                    onClick={() => toggleCategory(item.category)}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    {isExpanded ? <FolderOpen className="w-4 h-4 text-primary/70" /> : <Folder className="w-4 h-4 text-primary/70" />}
                    <span>{item.category}</span>
                  </div>
                );
              } else {
                const isActive = activeRuleId === item.id;
                return (
                  <div 
                    key={item.id}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    tabIndex={0}
                    className={`flex items-center gap-2 pl-8 pr-2 py-1 rounded cursor-pointer select-none text-sm ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50'} ${focusedIndex === index && !isActive ? 'ring-1 ring-primary/30' : ''}`}
                    onClick={() => item.rule && onSelectRule(item.rule)}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">{item.rule?.name}</span>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
