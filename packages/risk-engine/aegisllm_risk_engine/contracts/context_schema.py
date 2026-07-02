from typing import List, Dict, Any
from pydantic import BaseModel, Field
from aegisllm_risk_engine.contracts.finding_schema import Finding
from aegisllm_risk_engine.contracts.event_schema import BaseEvent

class ProcessingContext(BaseModel):
    """The central shared state for a single request."""
    correlation_id: str
    
    # Text data
    prompt: str
    normalized_prompt: str = ""
    
    # Accumulated State
    findings: List[Finding] = Field(default_factory=list)
    events: List[BaseEvent] = Field(default_factory=list)
    
    # Final outputs
    fingerprint: str = ""
    total_score: float = 0.0
    
    # Contextual metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        arbitrary_types_allowed = True
