// ============================================================
// @jarvis/shared - IPC Types
// ============================================================

import type { ServiceResponse } from './common.types.js';

/** Voice mode options */
export type VoiceMode = 'push-to-talk' | 'continuous' | 'wake-word';

/** Voice status */
export interface VoiceStatus {
  isListening: boolean;
  mode: VoiceMode;
  wakeWordEnabled: boolean;
  engineReady: boolean;
}

/** Screen capture result */
export interface ScreenCapture {
  buffer: ArrayBuffer;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
  timestamp: number;
  windowId?: string;
  windowTitle?: string;
}

/** Screen analysis result */
export interface AnalysisResult {
  description: string;
  elements: ScreenElement[];
  text?: string;
  codeBlocks?: CodeBlock[];
  errors?: DetectedError[];
  confidence: number;
  processingTime: number;
}

export interface ScreenElement {
  type: 'button' | 'input' | 'text' | 'image' | 'icon' | 'menu' | 'unknown';
  label?: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
}

export interface CodeBlock {
  language: string;
  content: string;
  lineRange?: { start: number; end: number };
}

export interface DetectedError {
  type: 'syntax' | 'runtime' | 'ui' | 'system';
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  suggestion?: string;
}

/** Window info */
export interface WindowInfo {
  id: string;
  title: string;
  processName: string;
  bounds: { x: number; y: number; width: number; height: number };
  isActive: boolean;
}

/** Automation request/response types */
export interface OpenAppRequest {
  appName: string;
  args?: string[];
  requireConfirmation?: boolean;
}

export interface OpenUrlRequest {
  url: string;
  browser?: 'default' | 'chrome' | 'firefox' | 'edge';
}

export interface SearchFilesRequest {
  query: string;
  directory?: string;
  extensions?: string[];
  maxResults?: number;
}

export interface SearchFileResult {
  path: string;
  name: string;
  size: number;
  modified: Date;
  isDirectory: boolean;
}

export type AutomationResponse<T = unknown> = ServiceResponse<T>;

/** Agent query context */
export interface QueryContext {
  conversationId?: string;
  activeWindow?: string;
  screenCapture?: string;
}

/** Agent response */
export interface AgentResponse {
  requestId: string;
  text: string;
  actions?: AgentAction[];
  suggestions?: string[];
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

export interface AgentAction {
  type: 'open_app' | 'open_url' | 'open_folder' | 'create_task' | 'store_memory' | 'execute';
  label: string;
  payload: Record<string, unknown>;
  requiresConfirmation: boolean;
}

/** Agent status */
export interface AgentStatus {
  isProcessing: boolean;
  activeRequestId?: string;
  activeAgent?: string;
  queueLength: number;
}

/** Thinking status for streaming */
export interface ThinkingStatus {
  requestId: string;
  stage: 'analyzing' | 'planning' | 'executing' | 'responding';
  progress: number;
  message?: string;
}

/** Notification */
export interface SystemNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  autoDismiss?: number;
}
