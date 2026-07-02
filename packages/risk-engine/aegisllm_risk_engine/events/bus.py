import abc
from typing import Callable, Dict, List
from aegisllm_risk_engine.contracts.event_schema import BaseEvent

EventHandler = Callable[[BaseEvent], None]

class EventBus(abc.ABC):
    @abc.abstractmethod
    def publish(self, event: BaseEvent) -> None:
        pass

    @abc.abstractmethod
    def subscribe(self, event_type: str, handler: EventHandler) -> None:
        pass

class SyncEventBus(EventBus):
    """Synchronous Event Bus for v1."""
    
    def __init__(self):
        self._subscribers: Dict[str, List[EventHandler]] = {}
        
    def subscribe(self, event_type: str, handler: EventHandler) -> None:
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)
        
    def publish(self, event: BaseEvent) -> None:
        event_type = event.__class__.__name__
        handlers = self._subscribers.get(event_type, [])
        for handler in handlers:
            handler(event)
