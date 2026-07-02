from enum import Enum
from typing import List, Dict, Any
from pydantic import BaseModel, Field

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Evidence(BaseModel):
    """Specific piece of evidence triggering a rule."""
    text: str = Field(description="The exact text matched")
    start: int = Field(description="Start index in normalized prompt")
    end: int = Field(description="End index in normalized prompt")
    rule_id: str = Field(description="The rule ID triggered")
    explanation: str = Field(default="", description="Explanation from the rule")

class Finding(BaseModel):
    """A detected anomaly encompassing multiple pieces of evidence."""
    category: str = Field(description="The risk category (e.g., Prompt Injection)")
    severity: Severity = Field(description="Highest severity among evidence")
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: List[Evidence] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
