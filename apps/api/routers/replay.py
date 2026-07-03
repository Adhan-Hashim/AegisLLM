from fastapi import APIRouter, HTTPException
from dependencies import get_store
from aegisllm_risk_engine.replay.engine import ReplayLoader, ReplayEngine

router = APIRouter(prefix="/v1")

@router.get("/sessions")
def get_all_sessions():
    """Returns a summary list of all historical sessions."""
    store = get_store()
    sessions = []
    
    for event in store.iter_all_events():
        # We stored the event type in the payload or the model itself.
        # Since JsonlAuditStore instantiates BaseEvent, we can check the payload.
        # Wait, JsonlAuditStore doesn't know about AnalysisCompleted, it just yields BaseEvent.
        # We need to rely on the event data.
        if event.payload.get("session") and event.module == "PipelineOrchestrator":
            session_data = event.payload["session"]
            sessions.append({
                "correlation_id": session_data.get("correlation_id"),
                "timestamp": event.timestamp_ns,
                "prompt": session_data.get("context", {}).get("prompt", ""),
                "decision": session_data.get("decision", {}).get("action", "ALLOW"),
                "risk_score": session_data.get("risk_analysis", {}).get("score", 0),
                "fingerprint": session_data.get("fingerprint", {}).get("hash_value", ""),
                "latency_ms": session_data.get("metrics", {}).get("total_processing_time_ns", 0) / 1_000_000
            })
            
    # Return newest first
    sessions.sort(key=lambda x: x["timestamp"], reverse=True)
    return {"sessions": sessions}

@router.get("/session/{correlation_id}")
def get_session(correlation_id: str):
    # Retrieve events from audit store
    store = get_store()
    loader = ReplayLoader(store)
    events = loader.load(correlation_id)
    
    if not events:
        raise HTTPException(status_code=404, detail="Session not found")
        
    engine = ReplayEngine()
    try:
        session = engine.reconstruct(events)
        # Note: A full reconstruction would populate the AnalysisSession perfectly.
        # For our v1 replay engine, we just return the correlation id to prove retrieval.
        return {"correlation_id": session.correlation_id, "status": "reconstructed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/replay/{correlation_id}")
def get_replay_events(correlation_id: str):
    store = get_store()
    loader = ReplayLoader(store)
    events = loader.load(correlation_id)
    
    if not events:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {"events": [e.model_dump() for e in events]}

