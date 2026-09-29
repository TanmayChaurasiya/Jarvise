// ============================================================
// @jarvis/shared - Window Type Definitions
// ============================================================

import type { ServiceResponse } from './common.types.js';
import type { IPCChannel } from '../contracts/ipc/channels.js';

/**
 * The typed API surface exposed to the Renderer process via contextBridge.
 * 
 * Rules:
 * 1. ONLY methods defined here are available in the Renderer.
 * 2. ALL communication happens over strictly allowed IPC channels.
 * 3. NO raw Node.js or Electron APIs are exposed.
 */
export interface JarvisWindowAPI {
  /**
   * Invokes an IPC handler in the main process and awaits the response.
   * @param channel The strongly-typed IPC channel
   * @param payload Optional payload
   * @returns A Promise resolving to a standardized ServiceResponse
   */
  invoke<TReq = unknown, TRes = unknown>(
    channel: IPCChannel,
    payload?: TReq,
  ): Promise<ServiceResponse<TRes>>;

  /**
   * Subscribes to events pushed from the main process.
   * @param channel The strongly-typed IPC channel
   * @param listener The callback function
   * @returns A cleanup function to remove the listener
   */
  on<TPayload = unknown>(
    channel: IPCChannel,
    listener: (payload: TPayload) => void,
  ): () => void;
}

// Extend the global Window object
declare global {
  interface Window {
    jarvis: JarvisWindowAPI;
  }
}
