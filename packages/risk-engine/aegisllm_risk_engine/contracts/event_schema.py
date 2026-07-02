import time
import uuid
from typing import Any, Dict
from pydantic import BaseModel, Field

class BaseEvent(BaseModel):
    """Immutable, past-tense event."""
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    correlation_id: str = Field(description="Tracks a single request through the pipeline")
    timestamp_ns: int = Field(default_factory=time.perf_counter_ns)
    module: str = Field(description="Name of the module that emitted the event")
    version: str = Field(description="Version of the module")
    payload: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        frozen = True  # Events are immutable
