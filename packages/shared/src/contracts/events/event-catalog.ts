// ============================================================
// @jarvis/shared - Event Catalog
// ============================================================

/**
 * Centralized catalog of all events in the JARVIS event bus.
 * All event emission and subscription MUST reference events defined here.
 */
export const EVENTS = {
  // ── Voice Events ──────────────────────────────────────
  VOICE_WAKE_WORD_DETECTED:   'voice:wake-word-detected',
  VOICE_LISTENING_STARTED:    'voice:listening-started',
  VOICE_LISTENING_STOPPED:    'voice:listening-stopped',
  VOICE_COMMAND_RECEIVED:     'voice:command-received',
  VOICE_TRANSCRIPT_READY:     'voice:transcript-ready',
  VOICE_TTS_STARTED:          'voice:tts-started',
  VOICE_TTS_COMPLETED:        'voice:tts-completed',

  // ── Vision Events ─────────────────────────────────────
  SCREEN_CAPTURE_REQUESTED:   'vision:capture-requested',
  SCREEN_CAPTURE_COMPLETED:   'vision:capture-completed',
  SCREEN_ANALYSIS_STARTED:    'vision:analysis-started',
  SCREEN_ANALYSIS_COMPLETED:  'vision:analysis-completed',
  ACTIVE_WINDOW_CHANGED:      'vision:active-window-changed',

  // ── Memory Events ─────────────────────────────────────
  MEMORY_STORED:              'memory:stored',
  MEMORY_UPDATED:             'memory:updated',
  MEMORY_RETRIEVED:           'memory:retrieved',
  MEMORY_SEARCH_COMPLETED:    'memory:search-completed',
  MEMORY_ARCHIVED:            'memory:archived',

  // ── Task Events ───────────────────────────────────────
  TASK_CREATED:               'task:created',
  TASK_UPDATED:               'task:updated',
  TASK_COMPLETED:             'task:completed',
  TASK_FAILED:                'task:failed',
  TASK_CANCELLED:             'task:cancelled',

  // ── Automation Events ─────────────────────────────────
  APPLICATION_OPENED:         'automation:app-opened',
  APPLICATION_CLOSED:         'automation:app-closed',
  WINDOW_SWITCHED:            'automation:window-switched',
  URL_OPENED:                 'automation:url-opened',
  FILE_OPERATION_COMPLETED:   'automation:file-op-completed',

  // ── Agent Events ──────────────────────────────────────
  AGENT_PROCESSING_STARTED:   'agent:processing-started',
  AGENT_INTENT_DETECTED:      'agent:intent-detected',
  AGENT_RESPONSE_READY:       'agent:response-ready',
  AGENT_RESPONSE_STREAMING:   'agent:response-streaming',
  AGENT_ERROR:                'agent:error',
  AGENT_TOOL_INVOKED:         'agent:tool-invoked',

  // ── Plugin Events ─────────────────────────────────────
  PLUGIN_LOADED:              'plugin:loaded',
  PLUGIN_UNLOADED:            'plugin:unloaded',
  PLUGIN_STARTED:             'plugin:started',
  PLUGIN_STOPPED:             'plugin:stopped',
  PLUGIN_ERROR:               'plugin:error',

  // ── System Events ─────────────────────────────────────
  SYSTEM_READY:               'system:ready',
  SYSTEM_SHUTDOWN:            'system:shutdown',
  SYSTEM_ERROR:               'system:error',
  SYSTEM_PERFORMANCE_ALERT:   'system:performance-alert',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

/** Type-safe event payload map */
export interface EventPayloadMap {
  [EVENTS.VOICE_WAKE_WORD_DETECTED]:   { confidence: number; timestamp: number };
  [EVENTS.VOICE_LISTENING_STARTED]:    { mode: string };
  [EVENTS.VOICE_LISTENING_STOPPED]:    { duration: number };
  [EVENTS.VOICE_COMMAND_RECEIVED]:     { text: string; confidence: number };
  [EVENTS.VOICE_TRANSCRIPT_READY]:     { text: string; isFinal: boolean };
  [EVENTS.VOICE_TTS_STARTED]:         { text: string };
  [EVENTS.VOICE_TTS_COMPLETED]:       { duration: number };
  [EVENTS.SCREEN_CAPTURE_REQUESTED]:   { source: string };
  [EVENTS.SCREEN_CAPTURE_COMPLETED]:   { width: number; height: number; timestamp: number };
  [EVENTS.SCREEN_ANALYSIS_STARTED]:    { requestId: string };
  [EVENTS.SCREEN_ANALYSIS_COMPLETED]:  { requestId: string; summary: string };
  [EVENTS.ACTIVE_WINDOW_CHANGED]:      { windowId: string; title: string; processName: string };
  [EVENTS.MEMORY_STORED]:             { memoryId: string; type: string };
  [EVENTS.MEMORY_UPDATED]:            { memoryId: string };
  [EVENTS.MEMORY_RETRIEVED]:          { memoryId: string; query: string };
  [EVENTS.MEMORY_SEARCH_COMPLETED]:   { query: string; resultCount: number };
  [EVENTS.MEMORY_ARCHIVED]:           { memoryId: string };
  [EVENTS.TASK_CREATED]:              { taskId: string; title: string };
  [EVENTS.TASK_UPDATED]:              { taskId: string; field: string };
  [EVENTS.TASK_COMPLETED]:            { taskId: string; duration: number };
  [EVENTS.TASK_FAILED]:               { taskId: string; error: string };
  [EVENTS.TASK_CANCELLED]:            { taskId: string; reason: string };
  [EVENTS.APPLICATION_OPENED]:        { appName: string; pid?: number };
  [EVENTS.APPLICATION_CLOSED]:        { appName: string };
  [EVENTS.WINDOW_SWITCHED]:           { windowId: string; title: string };
  [EVENTS.URL_OPENED]:                { url: string; browser: string };
  [EVENTS.FILE_OPERATION_COMPLETED]:  { type: string; path: string; success: boolean };
  [EVENTS.AGENT_PROCESSING_STARTED]:  { requestId: string; input: string };
  [EVENTS.AGENT_INTENT_DETECTED]:     { requestId: string; intent: string; confidence: number };
  [EVENTS.AGENT_RESPONSE_READY]:      { requestId: string; agentId: string };
  [EVENTS.AGENT_RESPONSE_STREAMING]:  { requestId: string; chunk: string; done: boolean };
  [EVENTS.AGENT_ERROR]:               { requestId: string; error: string };
  [EVENTS.AGENT_TOOL_INVOKED]:        { requestId: string; tool: string; agentId: string };
  [EVENTS.PLUGIN_LOADED]:             { pluginId: string; name: string };
  [EVENTS.PLUGIN_UNLOADED]:           { pluginId: string };
  [EVENTS.PLUGIN_STARTED]:            { pluginId: string };
  [EVENTS.PLUGIN_STOPPED]:            { pluginId: string };
  [EVENTS.PLUGIN_ERROR]:              { pluginId: string; error: string };
  [EVENTS.SYSTEM_READY]:              { version: string; startupTime: number };
  [EVENTS.SYSTEM_SHUTDOWN]:           { reason: string };
  [EVENTS.SYSTEM_ERROR]:              { error: string; fatal: boolean };
  [EVENTS.SYSTEM_PERFORMANCE_ALERT]:  { metric: string; value: number; threshold: number };
}
