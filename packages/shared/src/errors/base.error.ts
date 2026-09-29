// ============================================================
// @jarvis/shared - Base Error Classes
// ============================================================

/**
 * Base error class for all JARVIS errors.
 * Provides consistent error structure across the application.
 */
export class JarvisError extends Error {
  public readonly code: string;
  public readonly timestamp: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'JarvisError';
    this.code = code;
    this.timestamp = Date.now();
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      details: this.details,
    };
  }
}

/** Error thrown when a requested resource is not found */
export class NotFoundError extends JarvisError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundError';
  }
}

/** Error thrown when input validation fails */
export class ValidationError extends JarvisError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', { fields });
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/** Error thrown when an action is not authorized */
export class UnauthorizedError extends JarvisError {
  constructor(action: string, reason?: string) {
    super(
      `Unauthorized: ${action}${reason ? ` - ${reason}` : ''}`,
      'UNAUTHORIZED',
      { action, reason },
    );
    this.name = 'UnauthorizedError';
  }
}

/** Error thrown when a timeout is exceeded */
export class TimeoutError extends JarvisError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Operation timed out: ${operation} (${timeoutMs}ms)`,
      'TIMEOUT',
      { operation, timeoutMs },
    );
    this.name = 'TimeoutError';
  }
}
