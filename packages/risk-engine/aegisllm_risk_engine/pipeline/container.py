from typing import List, Type, Dict, Any
from aegisllm_risk_engine.contracts.detector_schema import IDetector
from aegisllm_risk_engine.registry.loader import PluginRegistry

class DIContainer:
    """Dependency Injection Container."""
    
    def __init__(self, registry: PluginRegistry):
        self.registry = registry
        self._instances: Dict[str, IDetector] = {}

    def get_all_detectors(self, config: Dict[str, Any] = None) -> List[IDetector]:
        """Instantiates and returns all registered detectors."""
        config = config or {}
        detectors = []
        
        # Sort by priority
        sorted_manifests = sorted(
            self.registry.manifests.values(),
            key=lambda m: m.priority,
            reverse=True
        )
        
        for manifest in sorted_manifests:
            if manifest.id not in self._instances:
                detector_class = self.registry.detectors.get(manifest.id)
                if detector_class:
                    # In a real enterprise system, we would inject config per module here
                    self._instances[manifest.id] = detector_class()
                    
            if manifest.id in self._instances:
                detectors.append(self._instances[manifest.id])
                
        return detectors
