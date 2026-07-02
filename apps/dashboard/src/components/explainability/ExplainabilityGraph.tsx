"use client";

import { useMemo, useEffect, useState } from "react";
import { ReactFlow, Controls, Background, Edge, Node, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAttackLabStore } from "@/store/attackLab";

export function ExplainabilityGraph() {
  const { events, decision, setInspectorData } = useAttackLabStore();
  
  // Calculate nodes and edges based on events
  const { nodes, edges } = useMemo(() => {
    const nds: Node[] = [];
    const eds: Edge[] = [];
    
    // Base Prompt Node
    nds.push({
      id: "prompt",
      position: { x: 250, y: 50 },
      data: { label: "Prompt Received" },
      style: { background: '#111827', color: '#ededed', border: '1px solid #27272a', borderRadius: '8px', padding: '10px' }
    });

    let currentY = 150;
    
    const hasNormalizer = events.some(e => e.event === "PromptNormalized");
    if (hasNormalizer) {
      nds.push({
        id: "normalizer",
        position: { x: 250, y: currentY },
        data: { label: "Normalizer" },
        style: { background: '#1e3a8a', color: '#ededed', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' }
      });
      eds.push({ id: "e-prompt-norm", source: "prompt", target: "normalizer", animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } });
      currentY += 100;
    }

    const findingsEvents = events.filter(e => e.event === "FindingCreated");
    const lastSource = hasNormalizer ? "normalizer" : "prompt";
    
    if (findingsEvents.length > 0) {
      // Create a node for each category
      findingsEvents.forEach((ev, idx) => {
        const findingId = `finding-${idx}`;
        const evidenceId = `evidence-${idx}`;
        const ruleId = `rule-${idx}`;
        const xOffset = 250 + (idx - (findingsEvents.length - 1) / 2) * 200; // Spread horizontally
        
        // 1. Finding Node (e.g. Prompt Injection)
        nds.push({
          id: findingId,
          position: { x: xOffset, y: currentY },
          data: { label: ev.data.category || "Finding" },
          style: { background: '#7c2d12', color: '#ededed', border: '1px solid #ea580c', borderRadius: '8px', padding: '10px' }
        });
        eds.push({ 
          id: `e-${lastSource}-${findingId}`, 
          source: lastSource, 
          target: findingId, 
          animated: true,
          style: { stroke: '#ea580c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' }
        });
        
        // 2. Evidence Node
        nds.push({
          id: evidenceId,
          position: { x: xOffset, y: currentY + 100 },
          data: { label: "Evidence Matched" },
          style: { background: '#111827', color: '#a1a1aa', border: '1px dashed #ef4444', borderRadius: '8px', padding: '10px' }
        });
        eds.push({ 
          id: `e-${findingId}-${evidenceId}`, 
          source: findingId, 
          target: evidenceId, 
          animated: true,
          style: { stroke: '#ef4444', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
        });

        // 3. Rule Node
        nds.push({
          id: ruleId,
          position: { x: xOffset, y: currentY + 200 },
          data: { label: `Rule: ${ev.data.rule_id || "Unknown"}` },
          style: { background: '#111827', color: '#a1a1aa', border: '1px dashed #52525b', borderRadius: '8px', padding: '10px' }
        });
        eds.push({ 
          id: `e-${evidenceId}-${ruleId}`, 
          source: evidenceId, 
          target: ruleId, 
          animated: true,
          style: { stroke: '#a1a1aa', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#a1a1aa' }
        });
      });
      
      currentY += 300;
      
      // Funnel back to Risk Aggregator
      nds.push({
        id: "risk",
        position: { x: 250, y: currentY },
        data: { label: "Risk Evaluated" },
        style: { background: '#4c1d95', color: '#ededed', border: '1px solid #8b5cf6', borderRadius: '8px', padding: '10px' }
      });
      
      findingsEvents.forEach((_, idx) => {
        eds.push({ 
          id: `e-rule-${idx}-risk`, 
          source: `rule-${idx}`, 
          target: "risk", 
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
        });
      });
      
      currentY += 100;
    } else if (events.some(e => e.event === "AnalysisComplete")) {
      // No findings, but complete
      nds.push({
        id: "risk",
        position: { x: 250, y: currentY },
        data: { label: "Risk Evaluated" },
        style: { background: '#14532d', color: '#ededed', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px' }
      });
      eds.push({ id: `e-${lastSource}-risk`, source: lastSource, target: "risk", animated: true, style: { stroke: '#22c55e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } });
      currentY += 100;
    }

    if (decision) {
      nds.push({
        id: "decision",
        position: { x: 250, y: currentY },
        data: { label: `Decision: ${decision.action}` },
        style: { 
          background: decision.action === 'BLOCK' ? '#7f1d1d' : '#14532d', 
          color: '#ffffff', 
          border: `1px solid ${decision.action === 'BLOCK' ? '#ef4444' : '#22c55e'}`, 
          borderRadius: '8px', 
          padding: '10px',
          fontWeight: 'bold'
        }
      });
      
      eds.push({ id: "e-risk-decision", source: "risk", target: "decision", animated: true, style: { stroke: decision.action === 'BLOCK' ? '#ef4444' : '#22c55e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: decision.action === 'BLOCK' ? '#ef4444' : '#22c55e' } });
    }

    return { nodes: nds, edges: eds };
  }, [events, decision]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    // Find associated event data for the inspector
    let inspectorData = { title: node.data.label, id: node.id, raw: {} };
    
    if (node.id === 'prompt') {
      inspectorData.raw = events.find(e => e.event === "PromptReceived")?.data || {};
    } else if (node.id === 'normalizer') {
      inspectorData.raw = events.find(e => e.event === "PromptNormalized")?.data || {};
    } else if (node.id.startsWith('finding-') || node.id.startsWith('evidence-') || node.id.startsWith('rule-')) {
      const idx = parseInt(node.id.split('-')[1]);
      const findingEvents = events.filter(e => e.event === "FindingCreated");
      inspectorData.raw = findingEvents[idx]?.data || {};
      
      if (node.id.startsWith('rule-')) {
        inspectorData.title = `Rule: ${findingEvents[idx]?.data.rule_id}`;
      } else if (node.id.startsWith('evidence-')) {
        inspectorData.title = `Evidence: ${findingEvents[idx]?.data.category}`;
      }
    } else if (node.id === 'risk') {
      inspectorData.raw = events.find(e => e.event === "AnalysisComplete")?.data.risk || {};
    } else if (node.id === 'decision') {
      inspectorData.raw = decision;
    }
    
    setInspectorData('node', node.id, inspectorData);
  };

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border/50 overflow-hidden relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={16} />
        <Controls className="bg-card border-border fill-foreground" />
      </ReactFlow>
    </div>
  );
}
