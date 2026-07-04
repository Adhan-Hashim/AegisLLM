"use client";

import React from 'react';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProtectedModels({ itemVars }: { itemVars: any }) {
  return (
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
  );
}
