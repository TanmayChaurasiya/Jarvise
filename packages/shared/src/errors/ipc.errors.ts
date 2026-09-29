// ============================================================
// @jarvis/shared - IPC Error Classes
// ============================================================

import { JarvisError } from './base.error.js';

/** Error thrown when an IPC channel is not recognized */
export class InvalidChannelError extends JarvisError {
  constructor(channel: string) {
    super(`Invalid IPC channel: ${channel}`, 'INVALID_CHANNEL', { channel });
    this.name = 'InvalidChannelError';
  }
}

/** Error thrown when IPC payload validation fails */
export class IPCValidationError extends JarvisError {
  constructor(channel: string, errors: string[]) {
    super(
      `IPC validation failed for channel ${channel}: ${errors.join(', ')}`,
      'IPC_VALIDATION_ERROR',
      { channel, errors },
    );
    this.name = 'IPCValidationError';
  }
}

/** Error thrown when IPC permission is denied */
export class IPCPermissionError extends JarvisError {
  constructor(channel: string, permission: string) {
    super(
      `Permission denied for IPC channel ${channel}: requires ${permission}`,
      'IPC_PERMISSION_DENIED',
      { channel, permission },
    );
    this.name = 'IPCPermissionError';
  }
}

/** Error thrown when IPC rate limit is exceeded */
export class IPCRateLimitError extends JarvisError {
  constructor(channel: string, limit: number) {
    super(
      `Rate limit exceeded for IPC channel ${channel}: max ${limit}/s`,
      'IPC_RATE_LIMITED',
      { channel, limit },
    );
    this.name = 'IPCRateLimitError';
  }
}
