import abc
from typing import Iterator, List
from aegisllm_risk_engine.contracts.event_schema import BaseEvent

class IAuditStore(abc.ABC):
    """Interface for storing and retrieving audit events."""
    
    @abc.abstractmethod
    def append(self, event: BaseEvent) -> None:
        """Appends a new event to the store."""
        pass
        
    @abc.abstractmethod
    def get_events(self, correlation_id: str) -> List[BaseEvent]:
        """Retrieves all events for a given correlation ID."""
        pass

    @abc.abstractmethod
    def iter_all_events(self) -> Iterator[BaseEvent]:
        """Iterates over all stored events."""
        pass
