import yaml
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from dependencies import get_orchestrator
from aegisllm_risk_engine.modules.prompt_injection.detector import PromptInjectionDetector
from aegisllm_risk_engine.core.compiler import RuleCompiler, RuleCompilerError, CompiledRule
from routers.analyze import map_session_to_response, AnalyzeRequest

router = APIRouter(prefix="/v1/rules")

class EvaluateRequest(BaseModel):
    prompt: str
    rule: str # Raw YAML string
    simulate: bool = True

class CompileRequest(BaseModel):
    rule: str # Raw YAML string

@router.post("/compile")
def compile_rule(request: CompileRequest):
    try:
        parsed = yaml.safe_load(request.rule)
    except yaml.YAMLError as e:
        return {"success": False, "errors": [f"YAML Error: {str(e)}"]}
        
    try:
        compiled = RuleCompiler.compile(parsed)
        return {"success": True, "rule_id": compiled.id}
    except RuleCompilerError as e:
        return {"success": False, "errors": e.errors}

@router.post("/evaluate")
def evaluate_rule(request: EvaluateRequest):
    try:
        parsed = yaml.safe_load(request.rule)
        compiled_rule = RuleCompiler.compile(parsed)
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML rule: {str(e)}")
    except RuleCompilerError as e:
        raise HTTPException(status_code=400, detail={"msg": "Rule Compilation Failed", "errors": e.errors})
        
    detector = PromptInjectionDetector()
    detector.compiled_rules = [compiled_rule]

    class MockContainer:
        def get_all_detectors(self, config=None):
            return [detector]
            
    custom_container = MockContainer()
    
    from aegisllm_risk_engine.events.bus import SyncEventBus
    from aegisllm_risk_engine.pipeline.orchestrator import PipelineOrchestrator
    
    orchestrator = PipelineOrchestrator(SyncEventBus(), custom_container, audit_store=None)
    session = orchestrator.process(request.prompt)
    
    return map_session_to_response(session, AnalyzeRequest(prompt=request.prompt))

class TestResponse(BaseModel):
    passed: int
    failed: int
    total: int
    coverage: float
    avg_execution_ms: float
    results: List[Dict[str, Any]]

@router.post("/test", response_model=TestResponse)
def test_rule(request: CompileRequest):
    try:
        parsed = yaml.safe_load(request.rule)
        compiled_rule = RuleCompiler.compile(parsed)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    detector = PromptInjectionDetector()
    detector.compiled_rules = [compiled_rule]
    
    class MockContainer:
        def get_all_detectors(self, config=None):
            return [detector]
            
    custom_container = MockContainer()
    from aegisllm_risk_engine.events.bus import SyncEventBus
    from aegisllm_risk_engine.pipeline.orchestrator import PipelineOrchestrator
    
    orchestrator = PipelineOrchestrator(SyncEventBus(), custom_container, audit_store=None)
    
    results = []
    passed = 0
    total_time = 0.0
    
    for test in compiled_rule.tests:
        # Measure performance
        import time
        start = time.perf_counter_ns()
        session = orchestrator.process(test.prompt)
        end = time.perf_counter_ns()
        
        exec_ms = (end - start) / 1_000_000
        total_time += exec_ms
        
        actual_decision = session.decision.action.value if session.decision else "ALLOW"
        actual_findings = len(session.context.findings) if session.context else 0
        
        test_passed = True
        fail_reasons = []
        
        if test.expected.decision and actual_decision != test.expected.decision:
            test_passed = False
            fail_reasons.append(f"Expected decision {test.expected.decision}, got {actual_decision}")
            
        if test.expected.findings_count is not None and actual_findings != test.expected.findings_count:
            test_passed = False
            fail_reasons.append(f"Expected {test.expected.findings_count} findings, got {actual_findings}")
            
        if test_passed:
            passed += 1
            
        results.append({
            "prompt": test.prompt,
            "passed": test_passed,
            "fail_reasons": fail_reasons,
            "execution_ms": round(exec_ms, 2)
        })
        
    total = len(compiled_rule.tests)
    coverage = 100.0 if total > 0 else 0.0 # Simplify coverage mapping for now
    avg_exec = (total_time / total) if total > 0 else 0.0
    
    return TestResponse(
        passed=passed,
        failed=total - passed,
        total=total,
        coverage=coverage,
        avg_execution_ms=round(avg_exec, 2),
        results=results
    )
