// ============================================================
// @jarvis/shared - Plugin Types
// ============================================================

import type { Unsubscribe } from './common.types.js';

/** Plugin lifecycle states */
export type PluginLifecycleState =
  | 'discovered'
  | 'initializing'
  | 'ready'
  | 'starting'
  | 'active'
  | 'stopping'
  | 'destroying'
  | 'error';

/** Plugin health check */
export interface PluginHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: Record<string, unknown>;
}

/** Plugin status */
export interface PluginStatus {
  id: string;
  state: PluginLifecycleState;
  health: PluginHealthCheck;
  uptime: number;
  lastError?: {
    message: string;
    timestamp: number;
  };
}

/** Plugin manifest - describes a plugin package */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  dependencies: string[];
  permissions: string[];
  config: {
    schema: Record<string, unknown>;
    defaults: Record<string, unknown>;
  };
}

/** Plugin configuration */
export interface PluginConfig {
  [key: string]: unknown;
}

/** Logger interface provided to plugins */
export interface IPluginLogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/** Storage interface provided to plugins */
export interface IPluginStorage {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

/** IPC service interface for plugins */
export interface IPluginIPCService {
  registerHandler(channel: string, handler: (...args: unknown[]) => Promise<unknown>): Unsubscribe;
  send(channel: string, ...args: unknown[]): void;
}

/** Context provided to plugins during initialization */
export interface PluginContext {
  eventBus: IPluginEventBus;
  logger: IPluginLogger;
  config: PluginConfig;
  services: {
    ipc: IPluginIPCService;
    storage: IPluginStorage;
  };
}

/** Event bus interface exposed to plugins */
export interface IPluginEventBus {
  emit(event: string, payload: unknown): void;
  on(event: string, handler: (payload: unknown) => void): Unsubscribe;
  once(event: string, handler: (payload: unknown) => void): Unsubscribe;
}

/** Plugin interface - every plugin must implement this */
export interface IPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly dependencies: string[];

  initialize(context: PluginContext): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  destroy(): Promise<void>;

  getStatus(): PluginStatus;
  getHealthCheck(): Promise<PluginHealthCheck>;
}
