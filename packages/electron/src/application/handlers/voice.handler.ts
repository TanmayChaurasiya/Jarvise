// ============================================================
// JARVIS - Voice IPC Handler (Electron)
// ============================================================

import { ServiceResponse } from '@jarvis/shared';
import { triggerVoiceListening } from '../../main.js';

/**
 * Handles 'voice:start-listening' from the React frontend
 * Triggers the hidden renderer to start recording audio.
 */
export async function handleVoiceStartListening(
  _event: Electron.IpcMainInvokeEvent,
  _payload: void
): Promise<ServiceResponse<void>> {
  try {
    triggerVoiceListening();
    return {
      success: true,
      data: undefined,
      timestamp: Date.now(),
      requestId: ''
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'VOICE_START_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: Date.now(),
      requestId: ''
    };
  }
}
