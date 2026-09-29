// ============================================================
// JARVIS - IPC Router
// ============================================================

import { ipcMain } from 'electron';
import { ALLOWED_INVOKE_CHANNELS, IPCChannel, ServiceResponse, IPC_CHANNELS } from '@jarvis/shared';
import { IPCValidator } from '../../infrastructure/security/ipc.validator.js';
import { handleAgentQuery } from './agent.handler.js';
import { handleVoiceStartListening } from './voice.handler.js';

type IpcHandler<TReq = unknown, TRes = unknown> = (
  event: Electron.IpcMainInvokeEvent,
  payload: TReq
) => Promise<ServiceResponse<TRes>>;

/**
 * The IPCRouter securely routes incoming IPC messages to their respective handlers.
 */
export class IPCRouter {
  private static handlers = new Map<IPCChannel, IpcHandler<any, any>>();

  /**
   * Registers a handler for a specific IPC channel.
   */
  public static register<TReq, TRes>(
    channel: IPCChannel,
    handler: IpcHandler<TReq, TRes>
  ): void {
    if (!ALLOWED_INVOKE_CHANNELS.has(channel)) {
      throw new Error(`Cannot register handler for disallowed channel: ${channel}`);
    }

    if (this.handlers.has(channel)) {
      throw new Error(`Handler already registered for channel: ${channel}`);
    }

    this.handlers.set(channel, handler);
  }

  /**
   * Initializes the IPC routing listener on the electron main process.
   * This should only be called once during app startup.
   */
  public static initialize(): void {
    // Register explicit handlers
    this.register(IPC_CHANNELS.AGENT_QUERY, handleAgentQuery);
    this.register(IPC_CHANNELS.VOICE_START_LISTENING, handleVoiceStartListening);

    // Intercept all IPC invoke events globally (if possible) or register explicitly
    // Since Electron's ipcMain requires explicit channel binding, we bind to the allowed channels.
    for (const channel of ALLOWED_INVOKE_CHANNELS) {
      ipcMain.handle(channel, async (event, payload) => {
        try {
          // 1. Validate Channel
          if (!IPCValidator.validateChannel(channel)) {
            return IPCValidator.createErrorResponse(
              new Error(`Invalid or disallowed channel: ${channel}`)
            );
          }

          // 2. Locate Handler
          const handler = this.handlers.get(channel as IPCChannel);
          if (!handler) {
            return IPCValidator.createErrorResponse(
              new Error(`No handler registered for channel: ${channel}`)
            );
          }

          // 3. Execute Handler
          // The handler itself is responsible for payload validation via shared Zod schemas
          return await handler(event, payload);
          
        } catch (error) {
          return IPCValidator.createErrorResponse(error);
        }
      });
    }
    
    console.log(`[IPC Router] Initialized ${ALLOWED_INVOKE_CHANNELS.size} allowed channels.`);
  }

  /**
   * Clears all registered handlers (useful for teardown/testing).
   */
  public static clear(): void {
    for (const channel of ALLOWED_INVOKE_CHANNELS) {
      ipcMain.removeHandler(channel);
    }
    this.handlers.clear();
  }
}
