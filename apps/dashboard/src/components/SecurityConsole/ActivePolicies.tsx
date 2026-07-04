"use client";

import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivePolicies({ itemVars }: { itemVars: any }) {
  return (
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
  );
}
