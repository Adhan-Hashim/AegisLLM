import time
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from aegisllm_risk_engine.contracts.finding_schema import Finding

class TimelineEntry(BaseModel):
    timestamp_ns: int = Field(default_factory=time.perf_counter_ns)
    detector: str = ""
    rule_id: str = ""
    category: str = ""
    delta: float = 0.0
    running_total: float = 0.0
    duration_ns: int = 0
    
    schema_version: str = "1.0.0"

class RiskAnalysis(BaseModel):
    score: float = 0.0
    timeline: List[TimelineEntry] = Field(default_factory=list)
    breakdown: Dict[str, float] = Field(default_factory=dict)
    top_findings: List[Finding] = Field(default_factory=list)
    recommendation: str = ""
    metrics: Dict[str, Any] = Field(default_factory=dict)
    
    version: str = "1.0.0"
