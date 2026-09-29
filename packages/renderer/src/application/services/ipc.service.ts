// ============================================================
// JARVIS - IPC Service (Renderer)
// ============================================================

import { IPCChannel, ServiceResponse } from '@jarvis/shared';

/**
 * Singleton service for interacting with the strictly-typed window.jarvis API.
 * React hooks should use this service instead of accessing window.jarvis directly.
 */
class IPCServiceImpl {
  /**
   * Invokes a command on the main process and awaits the response.
   */
  public async invoke<TReq = unknown, TRes = unknown>(
    channel: IPCChannel,
    payload?: TReq,
  ): Promise<ServiceResponse<TRes>> {
    try {
      if (!window.jarvis) {
        console.warn(`[IPC] JARVIS not available. Attempted to invoke: ${channel}`);
        return {
          success: false,
          error: { code: 'IPC_UNAVAILABLE', message: 'Not running in Electron' },
          timestamp: Date.now(),
          requestId: '',
        };
      }
      // Calls the exposed method from the preload script
      return await window.jarvis.invoke<TReq, TRes>(channel, payload);
    } catch (error) {
      // Catch any catastrophic failures before they hit the React boundary
      return {
        success: false,
        error: {
          code: 'IPC_INVOKE_FAILED',
          message: error instanceof Error ? error.message : 'Unknown IPC Error',
        },
        timestamp: Date.now(),
        requestId: '',
      };
    }
  }

  /**
   * Subscribes to push events from the main process.
   * Automatically returns a cleanup function to be used in React useEffect.
   */
  public on<TPayload = unknown>(
    channel: IPCChannel,
    listener: (payload: TPayload) => void,
  ): () => void {
    if (!window.jarvis) {
      console.warn(`[IPC] JARVIS not available. Attempted to subscribe to: ${channel}`);
      return () => {};
    }
    return window.jarvis.on<TPayload>(channel, listener);
  }
}

export const IPCService = new IPCServiceImpl();
