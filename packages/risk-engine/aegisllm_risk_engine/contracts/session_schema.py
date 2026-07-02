import uuid
import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

from aegisllm_risk_engine.contracts.context_schema import ProcessingContext
from aegisllm_risk_engine.contracts.scoring_schema import RiskAnalysis
from aegisllm_risk_engine.contracts.decision_schema import Decision, ExplainabilityTree

class Fingerprint(BaseModel):
    hash_value: str = ""
    algorithm_version: str = "1.0.0"

class AnalysisSession(BaseModel):
    """The top-level object representing one complete analysis lifecycle."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    correlation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_time_ns: int = Field(default_factory=time.perf_counter_ns)
    
    # Components populated during the pipeline
    context: Optional[ProcessingContext] = None
    risk_analysis: Optional[RiskAnalysis] = None
    decision: Optional[Decision] = None
    fingerprint: Optional[Fingerprint] = None
    explainability_tree: Optional[ExplainabilityTree] = None
    
    # Session-wide metrics (not just detector metrics)
    metrics: Dict[str, Any] = Field(default_factory=dict)
