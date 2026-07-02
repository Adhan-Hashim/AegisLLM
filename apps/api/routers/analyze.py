import asyncio
import json
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from dependencies import get_orchestrator
from aegisllm_risk_engine.events.bus import SyncEventBus
from aegisllm_risk_engine.contracts.api_schema import AnalyzeResponse, ApiRequestData, ApiAuditData

router = APIRouter(prefix="/v1")

class AnalyzeRequest(BaseModel):
    prompt: str
    metadata: Dict[str, Any] = {}

def map_session_to_response(session, request: AnalyzeRequest) -> AnalyzeResponse:
    return AnalyzeResponse(
        request=ApiRequestData(prompt=request.prompt, metadata=request.metadata),
        decision={
            "action": session.decision.action.value,
            "reason": session.decision.justification
        } if session.decision else {},
        risk={
            "score": session.risk_analysis.score if session.risk_analysis else 0,
            "level": "CRITICAL" if session.risk_analysis and session.risk_analysis.score >= 100 else "NORMAL"
        },
        timeline=session.risk_analysis.timeline if session.risk_analysis else [],
        findings=session.context.findings if session.context else [],
        fingerprint={"hash": session.fingerprint.hash_value} if session.fingerprint else {},
        metrics=session.metrics,
        audit=ApiAuditData(
            correlation_id=session.correlation_id,
            event_count=0, # Simplified
            processing_time_ms=session.metrics.get("total_processing_time_ns", 0) / 1_000_000,
            engine_version="1.0.0"
        )
    )

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_sync(request: AnalyzeRequest):
    orchestrator = get_orchestrator()
    session = orchestrator.process(request.prompt, request.metadata)
    return map_session_to_response(session, request)

@router.post("/analyze/stream")
async def analyze_stream(request: AnalyzeRequest):
    """Streams events as they occur in real time using Server-Sent Events."""
    queue = asyncio.Queue()
    loop = asyncio.get_running_loop()
    
    # Custom bus to trap events and feed them to the queue
    stream_bus = SyncEventBus()
    
    def on_event(event):
        # We must push to the async queue from the synchronous thread safely
        payload = {
            "event_type": event.__class__.__name__,
            "data": event.model_dump()
        }
        asyncio.run_coroutine_threadsafe(queue.put(payload), loop)
        
    # We subscribe a catch-all (or register directly)
    # The current SyncEventBus doesn't have a catch-all easily accessible without modifying it,
    # but we can monkey-patch or just subclass it here for the stream.
    # We will override the publish method to push everything to the queue.
    original_publish = stream_bus.publish
    
    def wrapped_publish(event):
        on_event(event)
        original_publish(event)
        
    stream_bus.publish = wrapped_publish
    
    # Get a dedicated orchestrator for this stream
    orchestrator = get_orchestrator(custom_bus=stream_bus)
    
    # Run the orchestrator in a thread so it doesn't block the async generator
    executor = ThreadPoolExecutor(max_workers=1)
    
    def run_pipeline():
        try:
            session = orchestrator.process(request.prompt, request.metadata)
            # Send final response payload
            final_data = map_session_to_response(session, request).model_dump()
            asyncio.run_coroutine_threadsafe(queue.put({"event_type": "AnalysisComplete", "data": final_data}), loop)
        except Exception as e:
            asyncio.run_coroutine_threadsafe(queue.put({"event_type": "Error", "data": str(e)}), loop)
        finally:
            asyncio.run_coroutine_threadsafe(queue.put(None), loop) # EOF signal

    executor.submit(run_pipeline)
    
    async def event_generator():
        while True:
            item = await queue.get()
            if item is None:
                break
            
            # Use small delays to make the streaming visible in the UI for the demo
            await asyncio.sleep(0.1) 
            yield {
                "event": item["event_type"],
                "data": json.dumps(item["data"])
            }
            
    return EventSourceResponse(event_generator())
