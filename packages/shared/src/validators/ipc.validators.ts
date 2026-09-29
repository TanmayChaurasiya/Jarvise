// ============================================================
// @jarvis/shared - IPC Validators
// ============================================================

import { z } from 'zod';
import type { ServiceResponse } from '../types/common.types.js';

/**
 * Validates an IPC request payload against a Zod schema.
 * Returns a ServiceResponse with the validated data or error details.
 */
export function validateIPCPayload<T extends z.ZodType>(
  schema: T,
  payload: unknown,
  channel: string,
): ServiceResponse<z.infer<T>> {
  const result = schema.safeParse(payload);

  if (result.success) {
    return {
      success: true,
      data: result.data as z.infer<T>,
      timestamp: Date.now(),
      requestId: '',
    };
  }

  const errorMessages = result.error.errors.map(
    (err) => `${err.path.join('.')}: ${err.message}`,
  );

  return {
    success: false,
    error: {
      code: 'IPC_VALIDATION_ERROR',
      message: `Validation failed for channel ${channel}`,
      details: { errors: errorMessages },
    },
    timestamp: Date.now(),
    requestId: '',
  };
}
