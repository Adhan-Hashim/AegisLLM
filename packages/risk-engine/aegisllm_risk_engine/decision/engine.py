from aegisllm_risk_engine.contracts.decision_schema import Decision, ActionDecision
from aegisllm_risk_engine.contracts.scoring_schema import RiskAnalysis

class DecisionEngine:
    """Maps a computed RiskAnalysis to an ActionDecision."""
    
    def __init__(self, thresholds: dict = None):
        self.thresholds = thresholds or {
            "ALLOW": 20.0,
            "REWRITE": 40.0,
            "REVIEW": 70.0,
            "BLOCK": 100.0
        }

    def decide(self, analysis: RiskAnalysis) -> Decision:
        val = analysis.score
        
        if val <= self.thresholds["ALLOW"]:
            action = ActionDecision.ALLOW
            reason = f"Score {val:.1f} is within ALLOW threshold."
        elif val <= self.thresholds["REWRITE"]:
            action = ActionDecision.REWRITE
            reason = f"Score {val:.1f} triggered REWRITE threshold."
        elif val <= self.thresholds["REVIEW"]:
            action = ActionDecision.REVIEW
            reason = f"Score {val:.1f} triggered REVIEW threshold."
        else:
            action = ActionDecision.BLOCK
            reason = f"Score {val:.1f} exceeds BLOCK threshold."
            
        return Decision(
            action=action, 
            justification=reason,
            engine_version="1.0.0"
        )
