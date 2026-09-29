// ============================================================
// @jarvis/shared - Permission Constants
// ============================================================

/**
 * Permission identifiers for the JARVIS permission system.
 * All gated actions must reference a permission defined here.
 */
export const PERMISSIONS = {
  // ── File System ───────────────────────────────────────
  FILE_READ:           'fs:read',
  FILE_WRITE:          'fs:write',
  FILE_DELETE:         'fs:delete',

  // ── Applications ──────────────────────────────────────
  APP_OPEN:            'app:open',
  APP_CLOSE:           'app:close',

  // ── Screen ────────────────────────────────────────────
  SCREEN_CAPTURE:      'screen:capture',
  SCREEN_ANALYZE:      'screen:analyze',

  // ── Voice ─────────────────────────────────────────────
  VOICE_LISTEN:        'voice:listen',
  VOICE_SPEAK:         'voice:speak',

  // ── Network ───────────────────────────────────────────
  NETWORK_HTTP:        'network:http',
  NETWORK_WS:          'network:ws',

  // ── System ────────────────────────────────────────────
  SYSTEM_INFO:         'system:info',
  SYSTEM_SHELL:        'system:shell',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Actions that require explicit user confirmation before execution.
 * These are high-risk or destructive operations.
 */
export const CONFIRMATION_REQUIRED: ReadonlySet<string> = new Set([
  PERMISSIONS.APP_CLOSE,
  PERMISSIONS.FILE_DELETE,
  PERMISSIONS.FILE_WRITE,
  PERMISSIONS.SYSTEM_SHELL,
]);

/**
 * Default permissions granted to all plugins.
 * Plugins must explicitly request additional permissions in their manifest.
 */
export const DEFAULT_PLUGIN_PERMISSIONS: readonly string[] = [
  PERMISSIONS.SYSTEM_INFO,
];

/**
 * Permissions that are never automatically granted and require explicit user approval.
 */
export const ELEVATED_PERMISSIONS: ReadonlySet<string> = new Set([
  PERMISSIONS.SYSTEM_SHELL,
  PERMISSIONS.FILE_DELETE,
]);
