// ============================================================
// @jarvis/shared - Application Constants
// ============================================================

/** Application metadata */
export const APP = {
  NAME: 'JARVIS',
  VERSION: '0.1.0',
  DESCRIPTION: 'AI Desktop Assistant',
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: 'localhost',
} as const;

/** Default AI configuration */
export const AI_DEFAULTS = {
  PROVIDER: 'openai' as const,
  OPENAI_MODEL: 'gpt-4o',
  OPENAI_VISION_MODEL: 'gpt-4o',
  OLLAMA_MODEL: 'llama3',
  OLLAMA_BASE_URL: 'http://localhost:11434',
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
} as const;

/** Performance thresholds */
export const PERFORMANCE = {
  STARTUP_TIME_MS: 3000,
  VOICE_RESPONSE_MS: 500,
  MEMORY_SEARCH_MS: 100,
  SCREEN_ANALYSIS_MS: 2000,
} as const;

/** Rate limiting defaults */
export const RATE_LIMITS = {
  IPC_MAX_REQUESTS_PER_SECOND: 50,
  API_MAX_REQUESTS_PER_MINUTE: 100,
  EVENT_BUS_MAX_EVENTS_PER_SECOND: 200,
} as const;

/** Voice defaults */
export const VOICE_DEFAULTS = {
  WAKE_WORD: 'hey jarvis',
  LANGUAGE: 'en-US',
  SILENCE_TIMEOUT_MS: 3000,
  MIN_CONFIDENCE: 0.6,
  SAMPLE_RATE: 16000,
} as const;

/** Memory defaults */
export const MEMORY_DEFAULTS = {
  MAX_ENTRIES: 10000,
  DEFAULT_IMPORTANCE: 'medium' as const,
  HISTORY_BUFFER_SIZE: 1000,
  SEARCH_RESULT_LIMIT: 20,
} as const;
