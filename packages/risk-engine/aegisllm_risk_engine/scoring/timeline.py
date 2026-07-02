from typing import List
import time
from aegisllm_risk_engine.contracts.scoring_schema import TimelineEntry

class RiskTimeline:
    """Manages the timestamped timeline of risk score accumulation."""
    
    def __init__(self):
        self._entries: List[TimelineEntry] = []
        self._current_score: float = 0.0

    def add_entry(self, detector: str, rule_id: str, category: str, score_delta: float, duration_ns: int) -> None:
        self._current_score += score_delta
        
        entry = TimelineEntry(
            timestamp_ns=time.perf_counter_ns(),
            detector=detector,
            rule_id=rule_id,
            category=category,
            delta=score_delta,
            running_total=self._current_score,
            duration_ns=duration_ns
        )
        self._entries.append(entry)

    def get_history(self) -> List[TimelineEntry]:
        return self._entries
        
    def get_final_score(self) -> float:
        return self._current_score
