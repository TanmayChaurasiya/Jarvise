// ============================================================
// JARVIS - UI Zustand Store
// ============================================================

import { create } from 'zustand';

interface UIState {
  isChatOpen: boolean;
  theme: 'dark' | 'light';
  notifications: Array<{ id: string; message: string; type: 'info' | 'error' }>;
  
  // Actions
  toggleChat: () => void;
  setChatOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (message: string, type?: 'info' | 'error') => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isChatOpen: false, // Default to hidden, "Orb Only" mode
  theme: 'dark', // Always dark by default
  notifications: [],

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  
  setTheme: (theme) => set({ theme }),
  
  addNotification: (message, type = 'info') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString(), message, type }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));
