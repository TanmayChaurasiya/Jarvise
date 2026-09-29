// ============================================================
// JARVIS - Electron Preload Script
// ============================================================

const { contextBridge, ipcRenderer } = require('electron');

// We must strictly enforce that the renderer cannot access Node/Electron modules.
// Expose the frozen API surface.
contextBridge.exposeInMainWorld('jarvis', {
  invoke: async (channel: string, payload?: unknown) => {
    return await ipcRenderer.invoke(channel, payload);
  },

  on: (channel: string, listener: (payload: unknown) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, payload: unknown) => listener(payload);
    ipcRenderer.on(channel, subscription);

    // Return cleanup function
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
