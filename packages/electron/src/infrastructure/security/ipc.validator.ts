// ============================================================
// JARVIS - IPC Validator (Security Infrastructure)
// ============================================================

import { 
  IPCChannel, 
  ALLOWED_INVOKE_CHANNELS, 
  ServiceResponse,
  JarvisError
} from '@jarvis/shared';

/**
 * Validates incoming IPC requests from the renderer process.
 */
export class IPCValidator {
  /**
   * Verifies that the requested channel is permitted for invocation.
   * Prevents prototype pollution or arbitrary string execution.
   */
  public static validateChannel(channel: string): channel is IPCChannel {
    if (!channel || typeof channel !== 'string') {
      return false;
    }

    if (!ALLOWED_INVOKE_CHANNELS.has(channel)) {
      return false;
    }

    return true;
  }

  /**
   * Standardizes the error response to ensure consistent format
   * without leaking stack traces to the renderer.
   */
  public static createErrorResponse(error: unknown): ServiceResponse<null> {
    if (error instanceof JarvisError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        timestamp: Date.now(),
        requestId: '',
      };
    }

    const err = error as Error;
    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred',
      },
      timestamp: Date.now(),
      requestId: '',
    };
  }
}
