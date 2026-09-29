// ============================================================
// @jarvis/shared - Date Utilities
// ============================================================

/**
 * Returns the current timestamp in milliseconds.
 */
export function now(): number {
  return Date.now();
}

/**
 * Formats a Date or timestamp to ISO string.
 */
export function toISO(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Calculates the elapsed time in milliseconds from a start timestamp.
 */
export function elapsed(startMs: number): number {
  return Date.now() - startMs;
}

/**
 * Returns a human-readable relative time string (e.g., "2 minutes ago").
 */
export function timeAgo(date: Date | number): string {
  const ms = Date.now() - (typeof date === 'number' ? date : date.getTime());
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
