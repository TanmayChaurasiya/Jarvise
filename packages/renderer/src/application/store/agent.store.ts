// ============================================================
// JARVIS - Agent Zustand Store
// ============================================================

import { create } from 'zustand';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface AgentState {
  orbState: OrbState;
  currentIntent: string | null;
  streamingText: string;
  activeAgent: string | null;
  
  // Actions
  setOrbState: (state: OrbState) => void;
  setCurrentIntent: (intent: string | null) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (text: string) => void;
  setActiveAgent: (agent: string | null) => void;
  resetState: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  orbState: 'idle',
  currentIntent: null,
  streamingText: '',
  activeAgent: null,

  setOrbState: (state) => set({ orbState: state }),
  
  setCurrentIntent: (intent) => set({ currentIntent: intent }),
  
  setStreamingText: (text) => set({ streamingText: text }),
  
  appendStreamingText: (text) => set((state) => ({ streamingText: state.streamingText + text })),
  
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  
  resetState: () => set({
    orbState: 'idle',
    currentIntent: null,
    streamingText: '',
    activeAgent: null
  })
}));
