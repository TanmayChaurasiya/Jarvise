// ============================================================
// @jarvis/shared - API Types
// ============================================================

/** AI provider selection */
export type AIProvider = 'openai' | 'ollama';

/** Agent process request */
export interface ProcessRequest {
  input: string;
  context?: {
    conversationId?: string;
    activeWindow?: string;
    screenCapture?: string;
  };
  options?: {
    provider?: AIProvider;
    model?: string;
    streaming?: boolean;
    temperature?: number;
    maxTokens?: number;
  };
}

/** Agent process response */
export interface ProcessResponse {
  requestId: string;
  intent: {
    type: string;
    confidence: number;
    parameters: Record<string, unknown>;
  };
  response: {
    text: string;
    actions?: Array<{
      type: string;
      label: string;
      payload: Record<string, unknown>;
      requiresConfirmation: boolean;
    }>;
    suggestions?: string[];
  };
  agent: {
    id: string;
    name: string;
  };
  metadata: {
    processingTime: number;
    tokensUsed: { prompt: number; completion: number };
    memoryAccessed: number;
  };
}

/** Screen analysis request */
export interface AnalyzeScreenRequest {
  screenshot: string; // base64
  context?: {
    activeWindow?: string;
    previousAnalysis?: string;
  };
  options?: {
    detectCode?: boolean;
    detectErrors?: boolean;
    performOCR?: boolean;
  };
}

/** Conversation DTOs */
export interface CreateConversationRequest {
  sessionId?: string;
  context?: {
    activeWindow?: string;
    screenContext?: string;
  };
  tags?: string[];
}

export interface ConversationDTO {
  _id: string;
  sessionId: string;
  messages: MessageDTO[];
  context: Record<string, unknown>;
  summary?: string;
  tags: string[];
  startedAt: string;
  endedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata: {
    source: 'voice' | 'text' | 'system';
    intent?: string;
    confidence?: number;
    agentId?: string;
    tokens?: { prompt: number; completion: number };
  };
}

/** Memory DTOs */
export type MemoryType =
  | 'conversation'
  | 'task'
  | 'preference'
  | 'project'
  | 'command'
  | 'file_access'
  | 'screen_context';

export type MemoryImportance = 'low' | 'medium' | 'high' | 'critical';

export interface CreateMemoryRequest {
  type: MemoryType;
  content: string;
  summary: string;
  importance?: MemoryImportance;
  source: {
    plugin: string;
    conversationId?: string;
    taskId?: string;
  };
  context?: {
    application?: string;
    project?: string;
    tags?: string[];
  };
}

export interface MemoryDTO {
  _id: string;
  type: MemoryType;
  content: string;
  summary: string;
  importance: MemoryImportance;
  source: {
    plugin: string;
    conversationId?: string;
    taskId?: string;
  };
  context: {
    application?: string;
    project?: string;
    tags: string[];
  };
  accessCount: number;
  lastAccessedAt: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemorySearchRequest {
  query: string;
  type?: MemoryType;
  importance?: MemoryImportance;
  tags?: string[];
  from?: string;
  to?: string;
  limit?: number;
}

/** Task DTOs */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  source?: 'voice' | 'manual' | 'agent' | 'scheduled';
  dueDate?: string;
  tags?: string[];
  subtasks?: Array<{ title: string }>;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TaskDTO {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  source: string;
  assignedAgent?: string;
  subtasks: Array<{
    id: string;
    title: string;
    status: TaskStatus;
    completedAt?: string;
  }>;
  dependencies: string[];
  context: {
    conversationId?: string;
    relatedMemories: string[];
    project?: string;
  };
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** Plugin DTOs */
export type PluginStatusType = 'installed' | 'active' | 'disabled' | 'error' | 'uninstalled';

export interface PluginInfoDTO {
  id: string;
  name: string;
  version: string;
  description: string;
  status: PluginStatusType;
  permissions: string[];
  config: Record<string, unknown>;
  metrics: {
    loadTime: number;
    invocationCount: number;
    errorCount: number;
    lastInvokedAt?: string;
  };
}

/** System config */
export interface SystemConfig {
  ai: {
    defaultProvider: AIProvider;
    openai: { model: string; maxTokens: number };
    ollama: { model: string; baseUrl: string };
  };
  voice: {
    wakeWord: string;
    language: string;
    defaultMode: 'push-to-talk' | 'continuous' | 'wake-word';
  };
  automation: {
    requireConfirmation: boolean;
    allowedApps: string[];
    allowedPaths: string[];
  };
}

/** WebSocket events */
export interface WSEvents {
  'agent:thinking': { requestId: string; stage: string; progress: number };
  'agent:streaming': { requestId: string; chunk: string; done: boolean };
  'task:updated': { taskId: string; status: TaskStatus };
  'memory:updated': { memoryId: string; type: MemoryType };
  'plugin:status': { pluginId: string; status: PluginStatusType };
  'system:metric': { metric: string; value: number };
}
