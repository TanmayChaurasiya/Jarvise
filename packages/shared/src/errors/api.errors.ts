// ============================================================
// @jarvis/shared - API Error Classes
// ============================================================

import { JarvisError } from './base.error.js';

/** Error thrown for bad API requests */
export class BadRequestError extends JarvisError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'BAD_REQUEST', details);
    this.name = 'BadRequestError';
  }
}

/** Error thrown when an API resource conflicts */
export class ConflictError extends JarvisError {
  constructor(resource: string, id: string) {
    super(`Conflict: ${resource} already exists: ${id}`, 'CONFLICT', { resource, id });
    this.name = 'ConflictError';
  }
}

/** Error thrown when an AI provider fails */
export class AIProviderError extends JarvisError {
  constructor(provider: string, message: string) {
    super(`AI Provider error (${provider}): ${message}`, 'AI_PROVIDER_ERROR', { provider });
    this.name = 'AIProviderError';
  }
}

/** Error thrown when a plugin operation fails */
export class PluginError extends JarvisError {
  constructor(pluginId: string, operation: string, message: string) {
    super(
      `Plugin error (${pluginId}): ${operation} - ${message}`,
      'PLUGIN_ERROR',
      { pluginId, operation },
    );
    this.name = 'PluginError';
  }
}

/** Error thrown for database operation failures */
export class DatabaseError extends JarvisError {
  constructor(operation: string, message: string) {
    super(`Database error: ${operation} - ${message}`, 'DATABASE_ERROR', { operation });
    this.name = 'DatabaseError';
  }
}
