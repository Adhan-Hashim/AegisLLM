from enum import Enum
from typing import List, Dict, Any
from pydantic import BaseModel, Field

class ActionDecision(str, Enum):
    ALLOW = "ALLOW"
    REWRITE = "REWRITE"
    REVIEW = "REVIEW"
    BLOCK = "BLOCK"

class Decision(BaseModel):
    action: ActionDecision = ActionDecision.ALLOW
    justification: str = ""
    engine_version: str = "1.0.0"

class ExplainabilityNode(BaseModel):
    node_type: str # Decision, Risk Score, Finding, Evidence, Rule, Prompt
    value: str
    children: List['ExplainabilityNode'] = Field(default_factory=list)

class ExplainabilityTree(BaseModel):
    """Strictly immutable explainability tree."""
    root: ExplainabilityNode
    schema_version: str = "1.0.0"

    class Config:
        frozen = True
