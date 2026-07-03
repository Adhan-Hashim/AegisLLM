import { useState, useEffect, useCallback, useRef } from 'react';
import { RuleFile } from '@/components/rules-studio/RuleExplorer';

export enum SaveState {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  SAVING = 'SAVING',
  SAVED = 'SAVED',
  ERROR = 'ERROR'
}

const STORAGE_PREFIX = 'aegisllm_rule_draft_';

export function useRulePersistence(activeRule: RuleFile | null) {
  const [saveState, setSaveState] = useState<SaveState>(SaveState.CLEAN);
  const [draftContent, setDraftContent] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft when active rule changes
  useEffect(() => {
    if (activeRule) {
      const draft = localStorage.getItem(`${STORAGE_PREFIX}${activeRule.id}`);
      if (draft && draft !== activeRule.content) {
        setDraftContent(draft);
        setSaveState(SaveState.DIRTY);
      } else {
        setDraftContent(activeRule.content);
        setSaveState(SaveState.CLEAN);
      }
    } else {
      setDraftContent('');
      setSaveState(SaveState.CLEAN);
    }
  }, [activeRule]);

  const save = useCallback(async (content: string, isManual = false) => {
    if (!activeRule) return;
    
    setSaveState(SaveState.SAVING);
    try {
      // Simulate network latency if saving to backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      localStorage.setItem(`${STORAGE_PREFIX}${activeRule.id}`, content);
      setSaveState(SaveState.SAVED);
      
      // Revert to clean after a short delay
      setTimeout(() => {
        setSaveState(prev => prev === SaveState.SAVED ? SaveState.CLEAN : prev);
      }, 2000);
    } catch (error) {
      console.error('Save failed', error);
      setSaveState(SaveState.ERROR);
    }
  }, [activeRule]);

  const updateContent = useCallback((content: string) => {
    setDraftContent(content);
    setSaveState(SaveState.DIRTY);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      save(content);
    }, 1500); // 1.5s debounce
  }, [save]);

  const manualSave = useCallback((content: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    save(content, true);
  }, [save]);

  return {
    saveState,
    draftContent,
    updateContent,
    manualSave
  };
}
