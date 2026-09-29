// ============================================================
// @jarvis/shared - IPC Channel Registry
// ============================================================

/**
 * Centralized registry of all IPC channel names.
 * All IPC communication MUST use channels defined here.
 * Adding a channel here is the first step in creating a new IPC endpoint.
 */
export const IPC_CHANNELS = {
  // ── Voice ─────────────────────────────────────────────
  VOICE_START_LISTENING:     'voice:start-listening',
  VOICE_STOP_LISTENING:      'voice:stop-listening',
  VOICE_PROCESS_AUDIO:       'voice:process-audio',
  VOICE_SET_MODE:            'voice:set-mode',
  VOICE_STATUS:              'voice:status',

  // ── Vision ────────────────────────────────────────────
  VISION_CAPTURE_SCREEN:     'vision:capture-screen',
  VISION_CAPTURE_WINDOW:     'vision:capture-window',
  VISION_ANALYZE:            'vision:analyze',
  VISION_GET_ACTIVE_WINDOW:  'vision:get-active-window',

  // ── Automation ────────────────────────────────────────
  AUTO_OPEN_APP:             'automation:open-app',
  AUTO_CLOSE_APP:            'automation:close-app',
  AUTO_SWITCH_WINDOW:        'automation:switch-window',
  AUTO_OPEN_URL:             'automation:open-url',
  AUTO_OPEN_FOLDER:          'automation:open-folder',
  AUTO_SEARCH_FILES:         'automation:search-files',

  // ── Memory ────────────────────────────────────────────
  MEMORY_STORE:              'memory:store',
  MEMORY_SEARCH:             'memory:search',
  MEMORY_GET_RECENT:         'memory:get-recent',

  // ── Agent ─────────────────────────────────────────────
  AGENT_QUERY:               'agent:query',
  AGENT_STATUS:              'agent:status',
  AGENT_CANCEL:              'agent:cancel',

  // ── System ────────────────────────────────────────────
  SYSTEM_GET_INFO:           'system:get-info',
  SYSTEM_GET_PERMISSIONS:    'system:get-permissions',
  SYSTEM_REQUEST_PERMISSION: 'system:request-permission',

  // ── Plugin ────────────────────────────────────────────
  PLUGIN_LIST:               'plugin:list',
  PLUGIN_ENABLE:             'plugin:enable',
  PLUGIN_DISABLE:            'plugin:disable',
  PLUGIN_GET_STATUS:         'plugin:get-status',

  // ── Events (Main → Renderer push) ────────────────────
  EVENT_VOICE_TRANSCRIPT:    'event:voice-transcript',
  EVENT_AGENT_RESPONSE:      'event:agent-response',
  EVENT_AGENT_THINKING:      'event:agent-thinking',
  EVENT_TASK_UPDATE:         'event:task-update',
  EVENT_SYSTEM_NOTIFICATION: 'event:system-notification',
  EVENT_PLUGIN_STATUS:       'event:plugin-status',
} as const;

export type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];

/** Set of channels allowed from renderer → main */
export const ALLOWED_INVOKE_CHANNELS = new Set<string>([
  IPC_CHANNELS.VOICE_START_LISTENING,
  IPC_CHANNELS.VOICE_STOP_LISTENING,
  IPC_CHANNELS.VOICE_PROCESS_AUDIO,
  IPC_CHANNELS.VOICE_SET_MODE,
  IPC_CHANNELS.VOICE_STATUS,
  IPC_CHANNELS.VISION_CAPTURE_SCREEN,
  IPC_CHANNELS.VISION_CAPTURE_WINDOW,
  IPC_CHANNELS.VISION_ANALYZE,
  IPC_CHANNELS.VISION_GET_ACTIVE_WINDOW,
  IPC_CHANNELS.AUTO_OPEN_APP,
  IPC_CHANNELS.AUTO_CLOSE_APP,
  IPC_CHANNELS.AUTO_SWITCH_WINDOW,
  IPC_CHANNELS.AUTO_OPEN_URL,
  IPC_CHANNELS.AUTO_OPEN_FOLDER,
  IPC_CHANNELS.AUTO_SEARCH_FILES,
  IPC_CHANNELS.MEMORY_STORE,
  IPC_CHANNELS.MEMORY_SEARCH,
  IPC_CHANNELS.MEMORY_GET_RECENT,
  IPC_CHANNELS.AGENT_QUERY,
  IPC_CHANNELS.AGENT_STATUS,
  IPC_CHANNELS.AGENT_CANCEL,
  IPC_CHANNELS.SYSTEM_GET_INFO,
  IPC_CHANNELS.SYSTEM_GET_PERMISSIONS,
  IPC_CHANNELS.SYSTEM_REQUEST_PERMISSION,
  IPC_CHANNELS.PLUGIN_LIST,
  IPC_CHANNELS.PLUGIN_ENABLE,
  IPC_CHANNELS.PLUGIN_DISABLE,
  IPC_CHANNELS.PLUGIN_GET_STATUS,
]);

/** Set of channels allowed from main → renderer (push events) */
export const ALLOWED_SEND_CHANNELS = new Set<string>([
  IPC_CHANNELS.EVENT_VOICE_TRANSCRIPT,
  IPC_CHANNELS.EVENT_AGENT_RESPONSE,
  IPC_CHANNELS.EVENT_AGENT_THINKING,
  IPC_CHANNELS.EVENT_TASK_UPDATE,
  IPC_CHANNELS.EVENT_SYSTEM_NOTIFICATION,
  IPC_CHANNELS.EVENT_PLUGIN_STATUS,
]);
