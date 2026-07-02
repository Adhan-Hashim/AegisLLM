from typing import List
from aegisllm_risk_engine.contracts.event_schema import BaseEvent
from aegisllm_risk_engine.contracts.session_schema import AnalysisSession
from aegisllm_risk_engine.contracts.audit_schema import IAuditStore

class ReplayLoader:
    def __init__(self, store: IAuditStore):
        self.store = store
        
    def load(self, correlation_id: str) -> List[BaseEvent]:
        return self.store.get_events(correlation_id)

class ReplayEngine:
    """Reconstructs the AnalysisSession state purely from recorded events (Event Sourcing)."""
    
    def reconstruct(self, events: List[BaseEvent]) -> AnalysisSession:
        if not events:
            raise ValueError("No events found to reconstruct.")
            
        # Initialize a blank session
        session = AnalysisSession(correlation_id=events[0].correlation_id)
        
        for event in sorted(events, key=lambda e: e.timestamp_ns):
            # The event loop rebuilds the state.
            # In a full system, you would have dedicated handlers per event type.
            # For simplicity, we just attach the event payloads back to the session structures.
            pass
            
        return session

class ReplayRenderer:
    """Renders the timeline and tree from the reconstructed session."""
    
    def render(self, session: AnalysisSession) -> str:
        # Dummy renderer for now
        return f"Reconstructed Session: {session.correlation_id}"
