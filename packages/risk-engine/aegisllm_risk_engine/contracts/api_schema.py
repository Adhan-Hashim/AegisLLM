from typing import List, Dict, Any
from pydantic import BaseModel
from aegisllm_risk_engine.contracts.finding_schema import Finding
from aegisllm_risk_engine.contracts.scoring_schema import TimelineEntry

# Stable API models mapped from internal models
class ApiRequestData(BaseModel):
    prompt: str
    metadata: Dict[str, Any]

class ApiAuditData(BaseModel):
    correlation_id: str
    event_count: int
    processing_time_ms: float
    engine_version: str

class AnalyzeResponse(BaseModel):
    """The stable JSON output for POST /v1/analyze"""
    request: ApiRequestData
    decision: Dict[str, Any]
    risk: Dict[str, Any]
    timeline: List[TimelineEntry]
    findings: List[Finding]
    fingerprint: Dict[str, str]
    metrics: Dict[str, Any]
    audit: ApiAuditData
