import os
import yaml
import re
from typing import List

from aegisllm_risk_engine.contracts.detector_schema import IDetector
from aegisllm_risk_engine.contracts.finding_schema import Finding, Evidence, Severity
from aegisllm_risk_engine.contracts.context_schema import ProcessingContext
from aegisllm_risk_engine.core.compiler import RuleCompiler, CompiledRule

class PromptInjectionDetector(IDetector):
    def __init__(self):
        self.compiled_rules: List[CompiledRule] = []
        self._load_rules()

    def _load_rules(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        rules_path = os.path.join(current_dir, 'rules', 'v1', 'prompt.yaml')
        
        with open(rules_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            raw_rules = data.get('rules', [])
            
        for rule_data in raw_rules:
            # The compiler acts as the single source of truth for validation and pre-compilation
            compiled = RuleCompiler.compile(rule_data)
            self.compiled_rules.append(compiled)

    def analyze(self, context: ProcessingContext) -> List[Finding]:
        text = context.normalized_prompt
        evidence_list = []
        highest_severity = "LOW"
        highest_confidence = 0.0
        
        severity_order = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        
        for rule in self.compiled_rules:
            for pattern in rule.compiled_patterns:
                for match in pattern.finditer(text):
                    evidence = Evidence(
                        text=match.group(0),
                        start=match.start(),
                        end=match.end(),
                        rule_id=rule.id,
                        explanation=rule.description
                    )
                    evidence_list.append(evidence)
                    
                    if severity_order.get(rule.severity, 0) > severity_order.get(highest_severity, 0):
                        highest_severity = rule.severity
                        
                    if rule.confidence_base > highest_confidence:
                        highest_confidence = rule.confidence_base

        findings = []
        if evidence_list:
            finding = Finding(
                category="Prompt Injection",
                severity=Severity(highest_severity),
                confidence=highest_confidence,
                evidence=evidence_list,
                metadata={}
            )
            findings.append(finding)
            
        return findings
