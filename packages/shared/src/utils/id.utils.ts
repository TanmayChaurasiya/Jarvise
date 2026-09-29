// ============================================================
// @jarvis/shared - ID Utilities
// ============================================================

/**
 * Generates a unique ID with an optional prefix.
 * Uses crypto.randomUUID() for collision-resistant IDs.
 */
export function generateId(prefix?: string): string {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
}

/**
 * Generates a request ID for tracking IPC/API requests.
 */
export function generateRequestId(): string {
  return generateId('req');
}

/**
 * Generates a correlation ID for event tracing.
 */
export function generateCorrelationId(): string {
  return generateId('cor');
}

/**
 * Validates that a string is a valid UUID v4.
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
