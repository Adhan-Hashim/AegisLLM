import time
from typing import List, Dict
from aegisllm_risk_engine.contracts.finding_schema import Finding
from aegisllm_risk_engine.contracts.scoring_schema import RiskAnalysis
from aegisllm_risk_engine.scoring.timeline import RiskTimeline

class RiskAggregator:
    """Aggregates findings into a single rich RiskAnalysis object and updates the timeline."""
    
    SEVERITY_WEIGHTS = {
        "LOW": 1.0,
        "MEDIUM": 2.5,
        "HIGH": 5.0,
        "CRITICAL": 10.0
    }
    
    def __init__(self, category_weights: Dict[str, float] = None):
        self.category_weights = category_weights or {
            "Prompt Injection": 40.0,
            "Jailbreak": 35.0,
            "PII": 20.0,
            "Malicious Payload": 50.0,
            "Toxicity": 15.0
        }

    def aggregate(self, findings: List[Finding]) -> RiskAnalysis:
        start_ns = time.perf_counter_ns()
        
        timeline = RiskTimeline()
        breakdown = {}
        
        # Sort findings by severity (CRITICAL first, then HIGH, etc.) for logical timeline accumulation
        severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
        sorted_findings = sorted(
            findings, 
            key=lambda f: severity_order.get(f.severity.value, 0), 
            reverse=True
        )
        
        # In this implementation, we accumulate score for each finding (or cap at max per category).
        # We will accumulate for each finding to show a rich timeline, capping the final score at 100.
        
        for finding in sorted_findings:
            cat = finding.category
            base_weight = self.category_weights.get(cat, 10.0)
            sev_weight = self.SEVERITY_WEIGHTS.get(finding.severity.value, 1.0)
            
            # Simple formula: Confidence * Severity Weight * Category Base
            score_delta = finding.confidence * sev_weight * base_weight
            
            # Update Breakdown
            breakdown[cat] = breakdown.get(cat, 0.0) + score_delta
            
            # We assume duration_ns is minimal for the aggregation step itself, 
            # but we can record 0 since the detector ran previously.
            # In a real system, the detector's duration might be passed here.
            rule_id = finding.evidence[0].rule_id if finding.evidence else "UNKNOWN"
            timeline.add_entry(
                detector=cat + "Module", 
                rule_id=rule_id,
                category=cat, 
                score_delta=score_delta, 
                duration_ns=0
            )
            
        final_score = min(timeline.get_final_score(), 100.0)
        
        # Generate simple recommendation
        recommendation = "Allow request"
        if final_score >= 100.0:
            recommendation = "Block request immediately"
        elif final_score >= 70.0:
            recommendation = "Review request manually"
        elif final_score >= 40.0:
            recommendation = "Rewrite request to remove unsafe components"
            
        elapsed_ns = time.perf_counter_ns() - start_ns
        
        return RiskAnalysis(
            score=final_score,
            timeline=timeline.get_history(),
            breakdown=breakdown,
            top_findings=sorted_findings[:3],
            recommendation=recommendation,
            metrics={"aggregation_time_ns": elapsed_ns}
        )
