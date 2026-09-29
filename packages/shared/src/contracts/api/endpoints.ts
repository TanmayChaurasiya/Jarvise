// ============================================================
// @jarvis/shared - API Endpoint Registry
// ============================================================

/**
 * Centralized registry of all REST API endpoints.
 * This is the single source of truth for API routes across
 * the backend and any HTTP clients.
 */
export const API_ENDPOINTS = {
  // ── Agent ─────────────────────────────────────────────
  AGENT: {
    PROCESS:        '/api/agent/process',
    ANALYZE_SCREEN: '/api/agent/analyze-screen',
    STATUS:         '/api/agent/status',
    CANCEL:         '/api/agent/cancel/:requestId',
  },

  // ── Conversations ─────────────────────────────────────
  CONVERSATIONS: {
    LIST:           '/api/conversations',
    GET:            '/api/conversations/:id',
    CREATE:         '/api/conversations',
    UPDATE:         '/api/conversations/:id',
    DELETE:         '/api/conversations/:id',
    ACTIVE:         '/api/conversations/active',
  },

  // ── Memory ────────────────────────────────────────────
  MEMORY: {
    LIST:           '/api/memory',
    CREATE:         '/api/memory',
    SEARCH:         '/api/memory/search',
    GET:            '/api/memory/:id',
    UPDATE:         '/api/memory/:id',
    DELETE:         '/api/memory/:id',
    TIMELINE:       '/api/memory/timeline',
  },

  // ── Tasks ─────────────────────────────────────────────
  TASKS: {
    LIST:           '/api/tasks',
    CREATE:         '/api/tasks',
    GET:            '/api/tasks/:id',
    UPDATE:         '/api/tasks/:id',
    DELETE:         '/api/tasks/:id',
    UPDATE_STATUS:  '/api/tasks/:id/status',
    ACTIVE:         '/api/tasks/active',
  },

  // ── Plugins ───────────────────────────────────────────
  PLUGINS: {
    LIST:           '/api/plugins',
    GET:            '/api/plugins/:id',
    ENABLE:         '/api/plugins/:id/enable',
    DISABLE:        '/api/plugins/:id/disable',
    GET_CONFIG:     '/api/plugins/:id/config',
    UPDATE_CONFIG:  '/api/plugins/:id/config',
  },

  // ── System ────────────────────────────────────────────
  SYSTEM: {
    HEALTH:         '/api/system/health',
    METRICS:        '/api/system/metrics',
    GET_CONFIG:     '/api/system/config',
    UPDATE_CONFIG:  '/api/system/config',
  },
} as const;

/** Helper to substitute route parameters */
export function buildUrl(
  template: string,
  params: Record<string, string>,
): string {
  let url = template;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  }
  return url;
}
