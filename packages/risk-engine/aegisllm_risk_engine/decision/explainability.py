from aegisllm_risk_engine.contracts.session_schema import AnalysisSession
from aegisllm_risk_engine.contracts.decision_schema import ExplainabilityTree, ExplainabilityNode

class ExplainabilityBuilder:
    """Builds an immutable explainability tree from an AnalysisSession."""
    
    @staticmethod
    def build(session: AnalysisSession) -> ExplainabilityTree:
        if not session.decision or not session.risk_analysis or not session.context:
            raise ValueError("Session is missing components required for explainability.")
            
        root = ExplainabilityNode(
            node_type="Decision",
            value=f"{session.decision.action.value} - {session.decision.justification}"
        )
        
        score_node = ExplainabilityNode(
            node_type="Risk Score",
            value=f"{session.risk_analysis.score:.1f}"
        )
        root.children.append(score_node)
        
        # We can link the timeline or direct findings. We'll use Findings for clarity.
        for finding in session.context.findings:
            finding_node = ExplainabilityNode(
                node_type="Finding",
                value=f"{finding.category} ({finding.severity.value}, Conf: {finding.confidence})"
            )
            score_node.children.append(finding_node)
            
            for ev in finding.evidence:
                ev_node = ExplainabilityNode(
                    node_type="Evidence",
                    value=f"Matched: '{ev.text}' (Rule: {ev.rule_id})"
                )
                finding_node.children.append(ev_node)
                
                rule_node = ExplainabilityNode(
                    node_type="Rule",
                    value=f"{ev.explanation}"
                )
                ev_node.children.append(rule_node)
                
        return ExplainabilityTree(root=root)
