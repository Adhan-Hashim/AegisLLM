import os
import yaml
import importlib.util
from typing import Dict, Any, Type
from pydantic import BaseModel
from aegisllm_risk_engine.contracts.detector_schema import IDetector

class ModuleManifest(BaseModel):
    id: str
    version: str
    author: str
    priority: int = 10
    depends_on: list = []
    events: list = []
    publishes: list = []

class PluginRegistry:
    """Discovers and loads detector modules based on their manifests."""
    
    def __init__(self, modules_dir: str):
        self.modules_dir = modules_dir
        self.manifests: Dict[str, ModuleManifest] = {}
        self.detectors: Dict[str, Type[IDetector]] = {}
        
    def discover(self):
        """Scans the modules directory for manifest.yaml files."""
        if not os.path.exists(self.modules_dir):
            return
            
        for item in os.listdir(self.modules_dir):
            mod_path = os.path.join(self.modules_dir, item)
            manifest_path = os.path.join(mod_path, "manifest.yaml")
            
            if os.path.isdir(mod_path) and os.path.exists(manifest_path):
                self._load_module(item, mod_path, manifest_path)
                
    def _load_module(self, module_id: str, mod_path: str, manifest_path: str):
        with open(manifest_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            
        manifest = ModuleManifest(**data)
        self.manifests[manifest.id] = manifest
        
        # Dynamically import detector.py
        detector_file = os.path.join(mod_path, "detector.py")
        if os.path.exists(detector_file):
            spec = importlib.util.spec_from_file_location(f"aegisllm_modules.{manifest.id}", detector_file)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                
                # Find the IDetector implementation
                for attr_name in dir(module):
                    attr = getattr(module, attr_name)
                    if isinstance(attr, type) and issubclass(attr, IDetector) and attr is not IDetector:
                        self.detectors[manifest.id] = attr
                        break
