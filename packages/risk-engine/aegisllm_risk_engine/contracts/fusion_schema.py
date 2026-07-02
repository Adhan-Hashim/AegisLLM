import abc
from typing import List
from aegisllm_risk_engine.contracts.finding_schema import Finding

class IConfidenceFusion(abc.ABC):
    """
    Interface for Confidence Fusion Engine.
    Fuses confidence scores from multiple detectors that found the same anomaly.
    """
    @abc.abstractmethod
    def fuse(self, findings: List[Finding]) -> float:
        pass
