import json
import os
from typing import Iterator, List
from pydantic import TypeAdapter

from aegisllm_risk_engine.contracts.audit_schema import IAuditStore
from aegisllm_risk_engine.contracts.event_schema import BaseEvent

class JsonlAuditStore(IAuditStore):
    """Local JSON Lines implementation of the AuditStore."""
    
    def __init__(self, file_path: str = "audit.jsonl"):
        self.file_path = file_path
        
    def append(self, event: BaseEvent) -> None:
        # We store the event class name so we can reconstruct it (in a real system we'd use a registry of event types)
        data = event.model_dump()
        data["_event_type"] = event.__class__.__name__
        
        with open(self.file_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(data) + "\n")
            
    def get_events(self, correlation_id: str) -> List[BaseEvent]:
        events = []
        for event in self.iter_all_events():
            if event.correlation_id == correlation_id:
                events.append(event)
        return events

    def iter_all_events(self) -> Iterator[BaseEvent]:
        if not os.path.exists(self.file_path):
            return
            
        with open(self.file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                data = json.loads(line)
                # Removing the internal type marker before reconstruction
                event_type = data.pop("_event_type", "BaseEvent")
                # In a robust system, we would map event_type back to the specific class
                # Here we fallback to BaseEvent for simplicity
                yield BaseEvent(**data)
