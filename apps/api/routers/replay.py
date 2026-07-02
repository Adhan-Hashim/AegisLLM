from fastapi import APIRouter, HTTPException
from dependencies import get_store
from aegisllm_risk_engine.replay.engine import ReplayLoader, ReplayEngine

router = APIRouter(prefix="/v1")

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
