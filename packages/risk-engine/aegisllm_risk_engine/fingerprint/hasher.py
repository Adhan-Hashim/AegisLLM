import hashlib
from typing import List
from aegisllm_risk_engine.contracts.finding_schema import Finding

class CanonicalHasher:
    """Generates deterministic attack fingerprints."""
    
    @staticmethod
    def compute_fingerprint(findings: List[Finding], normalized_prompt: str, rule_version: str = "1.0.0") -> str:
        if not findings:
            return ""
            
        rule_ids = set()
        categories = set()
        
        for finding in findings:
            categories.add(finding.category)
            for evidence in finding.evidence:
                rule_ids.add(evidence.rule_id)
                
        sorted_rules = sorted(list(rule_ids))
        sorted_categories = sorted(list(categories))
        
        # Hash the normalized prompt to ignore trivial whitespace/casing changes
        prompt_hash = hashlib.sha256(normalized_prompt.encode('utf-8')).hexdigest()
        
        # Build canonical payload
        payload = {
            "rules": sorted_rules,
            "categories": sorted_categories,
            "normalized_prompt_hash": prompt_hash,
            "rule_version": rule_version
        }
        
        payload_str = str(payload)
        full_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()
        
        # Short human-readable prefix: PI-JB-[HASH_PREFIX]
        # For simplicity, we just use the first 8 characters of the hash
        # and prepend the first letters of the categories (if applicable).
        
        prefix_parts = []
        for cat in sorted_categories:
            words = cat.split()
            if len(words) > 1:
                prefix = "".join(w[0].upper() for w in words)
            else:
                prefix = cat[:2].upper()
            prefix_parts.append(prefix)
            
        prefix_str = "-".join(prefix_parts)
        
        return f"{prefix_str}-{full_hash[:8]}"
