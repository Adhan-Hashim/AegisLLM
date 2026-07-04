import { RuleDocument, RuleDiagnostic, DiagnosticSeverity } from './types';
import { isMap, isSeq, YAMLMap } from 'yaml';

const ALLOWED_ROOT_KEYS = ['id', 'name', 'description', 'severity', 'confidence', 'recommendation', 'patterns'];
const ALLOWED_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function validateRule(doc: RuleDocument): RuleDiagnostic[] {
  const diagnostics: RuleDiagnostic[] = [];

  // If we couldn't parse the AST, we can't do semantic validation
  if (!doc.ast || !doc.ast.contents) {
    return diagnostics;
  }

  // Helper to get line/col from a node
  const getLocation = (node: any): { line: number; column: number } => {
    let line = 1;
    let column = 1;
    if (node && node.range) {
      const pos = doc.lineCounter.linePos(node.range[0]);
      if (pos) {
        line = pos.line;
        column = pos.col;
      }
    }
    return { line, column };
  };

  const contents = doc.ast.contents;
  if (!isMap(contents)) {
    return diagnostics;
  }

  // 1. Unknown Keys & Missing Fields
  let hasRecommendation = false;
  
  for (const item of contents.items) {
    const keyNode = item.key as any;
    const keyName = keyNode?.value;
    
    if (keyName && !ALLOWED_ROOT_KEYS.includes(keyName)) {
      const loc = getLocation(keyNode);
      diagnostics.push({
        code: 'RULE005',
        severity: DiagnosticSeverity.WARNING,
        message: `Unknown field '${keyName}'`,
        ...loc
      });
    }

    if (keyName === 'recommendation') {
      hasRecommendation = true;
      const valNode = item.value as any;
      if (!valNode || !valNode.value || valNode.value.trim() === '') {
        const loc = getLocation(item.value || keyNode);
        diagnostics.push({
          code: 'RULE004',
          severity: DiagnosticSeverity.ERROR,
          message: `Recommendation cannot be empty`,
          ...loc
        });
      }
    }

    if (keyName === 'severity') {
      const valNode = item.value as any;
      if (valNode && valNode.value && !ALLOWED_SEVERITIES.includes(valNode.value.toUpperCase())) {
        const loc = getLocation(valNode);
        diagnostics.push({
          code: 'RULE003',
          severity: DiagnosticSeverity.ERROR,
          message: `Invalid severity '${valNode.value}'. Must be one of: ${ALLOWED_SEVERITIES.join(', ')}`,
          ...loc
        });
      }
    }

    if (keyName === 'patterns' && isSeq(item.value)) {
      const patterns = item.value;
      const seenIds = new Set<string>();
      const seenRegex = new Set<string>();

      for (const patternItem of patterns.items) {
        if (isMap(patternItem)) {
          let idVal = '';
          let regexVal = '';
          let idNode: any = null;
          let regexNode: any = null;

          for (const pPair of patternItem.items) {
            const pKey = (pPair.key as any)?.value;
            if (pKey === 'id') {
              idVal = (pPair.value as any)?.value;
              idNode = pPair.value;
            }
            if (pKey === 'regex') {
              regexVal = (pPair.value as any)?.value;
              regexNode = pPair.value;
            }
          }

          if (idVal) {
            if (seenIds.has(idVal)) {
              const loc = getLocation(idNode);
              diagnostics.push({
                code: 'RULE001',
                severity: DiagnosticSeverity.ERROR,
                message: `Duplicate pattern ID '${idVal}'`,
                ...loc
              });
            }
            seenIds.add(idVal);
          }

          if (regexVal) {
            if (seenRegex.has(regexVal)) {
              const loc = getLocation(regexNode);
              diagnostics.push({
                code: 'RULE002',
                severity: DiagnosticSeverity.WARNING,
                message: `Duplicate regex pattern`,
                ...loc
              });
            }
            seenRegex.add(regexVal);
          } else {
            const loc = getLocation(patternItem);
            diagnostics.push({
              code: 'RULE006',
              severity: DiagnosticSeverity.ERROR,
              message: `Pattern must have a 'regex' field`,
              ...loc
            });
          }
        }
      }
    }
  }

  if (!hasRecommendation) {
    diagnostics.push({
      code: 'RULE007',
      severity: DiagnosticSeverity.WARNING,
      message: `Missing 'recommendation' field. It is strongly recommended to provide remediation steps.`,
      line: 1,
      column: 1
    });
  }

  return diagnostics;
}
