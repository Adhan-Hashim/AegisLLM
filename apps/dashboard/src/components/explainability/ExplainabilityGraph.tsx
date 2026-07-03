"use client";

import { ReactFlow, Controls, Background, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GraphModel } from "@/lib/replay/types";

interface ExplainabilityGraphProps {
  model: GraphModel;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string, nodeData: any) => void;
}

export function ExplainabilityGraph({ model, selectedNodeId, onNodeSelect }: ExplainabilityGraphProps) {
  // Convert our generic GraphModel to React Flow nodes/edges
  const rfNodes: Node[] = model.nodes.map(node => ({
    id: node.id,
    position: (node as any).position || { x: 250, y: 50 }, // Realistically layout logic belongs in the Builder, or a layout hook
    data: { label: node.label, ...node.data },
    style: {
      background: selectedNodeId === node.id ? '#1e40af' : '#111827',
      color: '#ededed',
      border: selectedNodeId === node.id ? '2px solid #60a5fa' : '1px solid #27272a',
      borderRadius: '8px',
      padding: '10px'
    }
  }));

  const rfEdges: Edge[] = model.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: true,
    style: { stroke: '#6b7280', strokeWidth: 2 }
  }));

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node.id, node.data);
    }
  };

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border/50 overflow-hidden relative">
      <ReactFlow 
        nodes={rfNodes} 
        edges={rfEdges} 
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
