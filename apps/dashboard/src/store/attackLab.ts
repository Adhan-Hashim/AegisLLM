import { create } from 'zustand';

export interface AttackLabState {
  events: any[];
  isRunning: boolean;
  decision: any | null;
  riskScore: number;
  timeline: any[];
  findings: any[];
  
  // Investigation Workspace State
  selectedNodeId: string | null;
  selectedEventIndex: number | null;
  inspectorData: any | null;
  
  // Actions
  addEvent: (event: any) => void;
  setRunning: (status: boolean) => void;
  setFinalState: (decision: any, riskScore: number, timeline: any[], findings: any[]) => void;
  reset: () => void;
  
  setInspectorData: (type: 'node' | 'event', idOrIndex: string | number, data: any) => void;
}

export const useAttackLabStore = create<AttackLabState>((set) => ({
  events: [],
  isRunning: false,
  decision: null,
  riskScore: 0,
  timeline: [],
  findings: [],

  selectedNodeId: null,
  selectedEventIndex: null,
  inspectorData: null,

  addEvent: (event) => set((state) => ({ 
    events: [...state.events, event],
  })),
  
  setRunning: (status) => set({ isRunning: status }),
  
  setFinalState: (decision, riskScore, timeline, findings) => set({
    decision,
    riskScore,
    timeline,
    findings,
    isRunning: false
  }),
  
  setInspectorData: (type, idOrIndex, data) => set((state) => {
    if (type === 'node') {
      return { selectedNodeId: idOrIndex as string, selectedEventIndex: null, inspectorData: data };
    }
    return { selectedEventIndex: idOrIndex as number, selectedNodeId: null, inspectorData: data };
  }),

  reset: () => set({ 
    events: [], 
    isRunning: false, 
    decision: null, 
    riskScore: 0, 
    timeline: [], 
    findings: [],
    selectedNodeId: null,
    selectedEventIndex: null,
    inspectorData: null,
  }),
}));
