import abc
from typing import List
from aegisllm_risk_engine.contracts.finding_schema import Finding
from aegisllm_risk_engine.contracts.context_schema import ProcessingContext

class IDetector(abc.ABC):
    """Interface for all detector modules."""
    
    @abc.abstractmethod
    def analyze(self, context: ProcessingContext) -> List[Finding]:
        """Analyzes the context and returns detected findings."""
        pass
