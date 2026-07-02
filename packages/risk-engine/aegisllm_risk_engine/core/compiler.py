import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, ValidationError

class RuleTestExpected(BaseModel):
    decision: Optional[str] = None
    findings_count: Optional[int] = None

class RuleTest(BaseModel):
    prompt: str
    expected: RuleTestExpected

class CompiledRule(BaseModel):
    id: str
    category: str
    severity: str
    confidence_base: float = 0.8
    description: str = ""
    patterns: List[str]
    compiled_patterns: Any = Field(exclude=True, default=None)
    recommendation: str = ""
    tests: List[RuleTest] = []
    
    class Config:
        arbitrary_types_allowed = True

class RuleCompilerError(Exception):
    def __init__(self, message: str, errors: list = None):
        super().__init__(message)
        self.errors = errors or []

class RuleCompiler:
    """
    Compiles raw Rule representations (YAML/JSON dictionary) into an optimized CompiledRule.
    Validates semantics, schema, and pre-compiles regex patterns.
    """
    
    @staticmethod
    def compile(rule_data: Dict[str, Any]) -> CompiledRule:
        errors = []
        
        # 1. Schema Validation
        try:
            rule = CompiledRule(**rule_data)
        except ValidationError as e:
            for err in e.errors():
                loc = ".".join(str(l) for l in err["loc"])
                errors.append(f"Schema Error at '{loc}': {err['msg']}")
            raise RuleCompilerError("Schema validation failed", errors)
            
        # 2. Semantic Validation
        valid_severities = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
        if rule.severity not in valid_severities:
            errors.append(f"Invalid severity '{rule.severity}'. Must be one of {valid_severities}")
            
        if not (0.0 <= rule.confidence_base <= 1.0):
            errors.append(f"Confidence base must be between 0.0 and 1.0, got {rule.confidence_base}")
            
        if not rule.patterns:
            errors.append("Rule must contain at least one pattern.")
            
        # 3. Compile Regex Patterns
        compiled_regexes = []
        for i, pattern in enumerate(rule.patterns):
            try:
                # Pre-compile the regex
                compiled = re.compile(pattern, re.IGNORECASE)
                compiled_regexes.append(compiled)
            except re.error as e:
                errors.append(f"Invalid regex at pattern index {i} ('{pattern}'): {str(e)}")
                
        if errors:
            raise RuleCompilerError("Semantic validation failed", errors)
            
        rule.compiled_patterns = compiled_regexes
        return rule
