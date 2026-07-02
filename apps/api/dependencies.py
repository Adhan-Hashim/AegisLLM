import os
from typing import Optional
from aegisllm_risk_engine.events.bus import SyncEventBus
from aegisllm_risk_engine.registry.loader import PluginRegistry
from aegisllm_risk_engine.pipeline.container import DIContainer
from aegisllm_risk_engine.pipeline.orchestrator import PipelineOrchestrator
from aegisllm_risk_engine.replay.store import JsonlAuditStore

# Singleton-like instantiation for the API
_bus: Optional[SyncEventBus] = None
_registry: Optional[PluginRegistry] = None
_container: Optional[DIContainer] = None
_store: Optional[JsonlAuditStore] = None

def get_orchestrator(custom_bus: Optional[SyncEventBus] = None) -> PipelineOrchestrator:
    global _bus, _registry, _container, _store
    
    if _registry is None:
        # Resolve the modules path relative to the current file (or rely on env vars)
        # For this prototype, we'll traverse up to packages/risk-engine
        current_dir = os.path.dirname(os.path.abspath(__file__))
        modules_dir = os.path.join(
            os.path.dirname(os.path.dirname(current_dir)), 
            "packages", "risk-engine", "aegisllm_risk_engine", "modules"
        )
        _registry = PluginRegistry(modules_dir)
        _registry.discover()
        _container = DIContainer(_registry)
        
        # Ensure we have a data dir for the audit store
        data_dir = os.path.join(current_dir, "data")
        os.makedirs(data_dir, exist_ok=True)
        audit_file = os.path.join(data_dir, "audit.jsonl")
        _store = JsonlAuditStore(audit_file)
        
    bus_to_use = custom_bus if custom_bus else SyncEventBus()
    return PipelineOrchestrator(bus_to_use, _container, audit_store=_store)

def get_store() -> JsonlAuditStore:
    # Ensure initialized
    if _store is None:
        get_orchestrator()
    return _store
