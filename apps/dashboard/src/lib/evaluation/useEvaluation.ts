import { useState, useRef, useCallback } from 'react';
import { RuleEvaluationService } from './service';
import { 
  EvaluationState, 
  EvaluationRequest, 
  EvaluationSession,
  EvaluationErrorCodes
} from './types';

const DEFAULT_TIMEOUT = 10_000;

export function useEvaluation() {
  const [sessions, setSessions] = useState<EvaluationSession[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // We consider the "current" session to be the latest one in the array
  // If the latest one is running/error, the "previous" successful one is the one before it.
  const currentSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const previousSession = sessions.length > 1 ? sessions[sessions.length - 2] : null;

  const evaluate = useCallback(async (
    request: EvaluationRequest, 
    options?: { timeout?: number }
  ) => {
    // Cancel any inflight evaluation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeout = options?.timeout || DEFAULT_TIMEOUT;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const newSession: EvaluationSession = {
      id: crypto.randomUUID(),
      startedAt: new Date(),
      state: EvaluationState.RUNNING,
      request
    };

    setSessions(prev => [...prev, newSession]);

    try {
      const result = await RuleEvaluationService.evaluate(request, controller.signal);
      
      setSessions(prev => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].id === newSession.id) {
          copy[lastIdx] = {
            ...copy[lastIdx],
            state: EvaluationState.SUCCESS,
            finishedAt: new Date(),
            result
          };
        }
        return copy;
      });

    } catch (error: any) {
      let state = EvaluationState.ERROR;
      
      if (error.code === EvaluationErrorCodes.CANCELLED) {
        state = EvaluationState.CANCELLED;
      }
      
      setSessions(prev => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].id === newSession.id) {
          copy[lastIdx] = {
            ...copy[lastIdx],
            state,
            finishedAt: new Date(),
            error
          };
        }
        return copy;
      });
    } finally {
      clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      setSessions(prev => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].state === EvaluationState.RUNNING) {
          copy[lastIdx] = { ...copy[lastIdx], state: EvaluationState.CANCELLING };
        }
        return copy;
      });
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    sessions,
    currentSession,
    previousSession,
    evaluate,
    cancel
  };
}
