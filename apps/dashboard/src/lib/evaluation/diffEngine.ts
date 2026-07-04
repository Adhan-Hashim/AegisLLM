import { 
  EvaluationSession, 
  EvaluationDiffResult, 
  Finding, 
  ChangeType, 
  FindingDiff,
  DiffSummary
} from './types';

export class DiffEngine {
  static compare(previous: EvaluationSession | null, current: EvaluationSession): EvaluationDiffResult | null {
    if (!previous || !previous.result || !current.result) {
      return null;
    }

    const prevResult = previous.result;
    const currResult = current.result;

    const scoreDelta = currResult.score - prevResult.score;
    const decisionChanged = currResult.decision.action !== prevResult.decision.action;
    const latencyDelta = currResult.metrics.latency - prevResult.metrics.latency;
    
    // We compute severity change based on the highest finding severity
    // A simplified metric: if block/allow changes, behavior changes.
    // We can also see if new findings are higher severity, but let's stick to simple tracking.
    const severityMap: Record<string, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
    const maxPrevSev = Math.max(0, ...prevResult.findings.map(f => severityMap[f.severity] || 0));
    const maxCurrSev = Math.max(0, ...currResult.findings.map(f => severityMap[f.severity] || 0));
    const severityChanged = maxPrevSev !== maxCurrSev;

    // Compare findings by identity: ruleId + category + description
    const makeIdentity = (f: Finding) => `${f.id}:${f.severity}:${f.description}`;
    
    const prevFindingsMap = new Map(prevResult.findings.map(f => [makeIdentity(f), f]));
    const currFindingsMap = new Map(currResult.findings.map(f => [makeIdentity(f), f]));

    const findingsAdded: Finding[] = [];
    const findingsRemoved: Finding[] = [];
    const findingsModified: FindingDiff[] = [];

    // Check for added/modified
    for (const [id, currF] of currFindingsMap.entries()) {
      const prevF = prevFindingsMap.get(id);
      if (!prevF) {
        findingsAdded.push(currF);
      } else {
        // Here we could check for confidence changes as modifications
        if (currF.confidence !== prevF.confidence) {
          findingsModified.push({
            type: ChangeType.MODIFIED,
            finding: currF,
            previousFinding: prevF
          });
        }
      }
    }

    // Check for removed
    for (const [id, prevF] of prevFindingsMap.entries()) {
      if (!currFindingsMap.has(id)) {
        findingsRemoved.push(prevF);
      }
    }

    // Rules added/removed (based on unique finding IDs)
    const prevRules = new Set(prevResult.findings.map(f => f.id));
    const currRules = new Set(currResult.findings.map(f => f.id));
    
    const addedRules = [...currRules].filter(r => !prevRules.has(r));
    const removedRules = [...prevRules].filter(r => !currRules.has(r));

    const totalChanges = findingsAdded.length + findingsRemoved.length + findingsModified.length + addedRules.length + removedRules.length;
    const behaviorChanged = decisionChanged || scoreDelta !== 0 || severityChanged || totalChanges > 0;
    
    // Breaking change if we went from ALLOW -> BLOCK
    const breaking = prevResult.decision.action === 'ALLOW' && currResult.decision.action === 'BLOCK';

    const summary: DiffSummary = {
      totalChanges,
      breaking,
      behaviorChanged
    };

    return {
      scoreDelta,
      decisionChanged,
      latencyDelta,
      severityChanged,
      findingsAdded,
      findingsRemoved,
      findingsModified,
      addedRules,
      removedRules,
      summary
    };
  }
}
