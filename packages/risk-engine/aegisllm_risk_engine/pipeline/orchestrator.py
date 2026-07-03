import time
import uuid
from typing import Dict, Any

from aegisllm_risk_engine.events.bus import EventBus
from aegisllm_risk_engine.pipeline.container import DIContainer
from aegisllm_risk_engine.contracts.context_schema import ProcessingContext
from aegisllm_risk_engine.contracts.session_schema import AnalysisSession, Fingerprint
from aegisllm_risk_engine.contracts.event_schema import BaseEvent
from aegisllm_risk_engine.scoring.aggregator import RiskAggregator
from aegisllm_risk_engine.decision.engine import DecisionEngine
from aegisllm_risk_engine.decision.explainability import ExplainabilityBuilder
from aegisllm_risk_engine.fingerprint.hasher import CanonicalHasher
from aegisllm_risk_engine.contracts.audit_schema import IAuditStore

# Immutable Past-Tense Events
class PromptReceived(BaseEvent): pass
class PromptNormalized(BaseEvent): pass
class DetectorExecuted(BaseEvent): pass
class FindingCreated(BaseEvent): pass
class RiskCalculated(BaseEvent): pass
class DecisionGenerated(BaseEvent): pass
class FingerprintGenerated(BaseEvent): pass
class AnalysisCompleted(BaseEvent): pass

class PipelineOrchestrator:
    """The central orchestrator for the risk engine, returning a full AnalysisSession."""
    
    def __init__(self, event_bus: EventBus, container: DIContainer, audit_store: IAuditStore = None):
        self.bus = event_bus
        self.container = container
        self.audit_store = audit_store
        
        # Subscribe the audit store to all events if provided
        if self.audit_store:
            # A real implementation might use a wildcard subscription.
            # Here we just override the publish method locally or register manually.
            pass

    def _publish(self, event: BaseEvent):
        self.bus.publish(event)
        if self.audit_store:
            self.audit_store.append(event)

    def process(self, prompt: str, metadata: Dict[str, Any] = None) -> AnalysisSession:
        session = AnalysisSession()
        
        context = ProcessingContext(
            correlation_id=session.correlation_id,
            prompt=prompt,
            metadata=metadata or {}
        )
        session.context = context
        
        # 1. Fire Initial Event
        self._publish(PromptReceived(
            correlation_id=session.correlation_id,
            module="pipeline",
            version="1.0.0",
            payload={"length": len(prompt)}
        ))
        
        # 2. Normalize Prompt
        context.normalized_prompt = prompt.lower().strip() 
        self._publish(PromptNormalized(
            correlation_id=session.correlation_id,
            module="normalizer",
            version="1.0.0",
            payload={}
        ))
        
        # 3. Run Detectors
        detectors = self.container.get_all_detectors()
        for detector in detectors:
            start_ns = time.perf_counter_ns()
            findings = detector.analyze(context)
            elapsed_ns = time.perf_counter_ns() - start_ns
            
            self._publish(DetectorExecuted(
                correlation_id=session.correlation_id,
                module=detector.__class__.__name__,
                version="1.0.0",
                payload={"execution_time_ns": elapsed_ns, "findings_count": len(findings)}
            ))
            
            for finding in findings:
                context.findings.append(finding)
                self._publish(FindingCreated(
                    correlation_id=session.correlation_id,
                    module=detector.__class__.__name__,
                    version="1.0.0",
                    payload={"finding": finding.model_dump()}
                ))
                
        # 4. Aggregation
        aggregator = RiskAggregator()
        session.risk_analysis = aggregator.aggregate(context.findings)
        self._publish(RiskCalculated(
            correlation_id=session.correlation_id,
            module="RiskAggregator",
            version="1.0.0",
            payload={"score": session.risk_analysis.score}
        ))
        
        # 5. Decision
        decision_engine = DecisionEngine()
        session.decision = decision_engine.decide(session.risk_analysis)
        self._publish(DecisionGenerated(
            correlation_id=session.correlation_id,
            module="DecisionEngine",
            version="1.0.0",
            payload={"action": session.decision.action.value}
        ))
        
        # 6. Explainability Tree
        session.explainability_tree = ExplainabilityBuilder.build(session)
        
        # 7. Fingerprint
        hash_val = CanonicalHasher.compute_fingerprint(context.findings, context.normalized_prompt)
        session.fingerprint = Fingerprint(hash_value=hash_val)
        self._publish(FingerprintGenerated(
            correlation_id=session.correlation_id,
            module="CanonicalHasher",
            version="1.0.0",
            payload={"fingerprint": hash_val}
        ))
        
        # 8. Wrap up metrics
        end_time_ns = time.perf_counter_ns()
        session.metrics["total_processing_time_ns"] = end_time_ns - session.start_time_ns
        
        # 9. Emit final AnalysisCompleted event to store the full session representation
        self._publish(AnalysisCompleted(
            correlation_id=session.correlation_id,
            module="PipelineOrchestrator",
            version="1.0.0",
            payload={"session": session.model_dump()}
        ))
        
        return session
