import { ReplaySession, GraphModel, GraphNode, GraphEdge } from '../types';

export class GraphBuilder {
  public build(session: ReplaySession): GraphModel {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Simple implementation for demonstration
    // In reality, this would build a node for prompt, normalizers, detectors, findings, decision

    nodes.push({ id: 'prompt', label: 'User Prompt', type: 'input' });

    let lastId = 'prompt';

    session.findings.forEach((finding, idx) => {
      const id = `finding-${idx}`;
      nodes.push({ id, label: `Finding: ${finding.data?.riskScore || 0}`, type: 'finding', data: finding });
      edges.push({ id: `e-${lastId}-${id}`, source: lastId, target: id });
      lastId = id;
    });

    if (session.decision) {
      nodes.push({ id: 'decision', label: `Decision: ${session.decision.action}`, type: 'decision', data: session.decision });
      edges.push({ id: `e-${lastId}-decision`, source: lastId, target: 'decision' });
    }

    return { nodes, edges };
  }
}
