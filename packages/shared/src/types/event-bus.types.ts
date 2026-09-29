// ============================================================
// @jarvis/shared - Event Bus Types
// ============================================================

import type { Unsubscribe } from './common.types.js';

/** Event categories */
export enum EventCategory {
  VOICE = 'voice',
  VISION = 'vision',
  MEMORY = 'memory',
  TASK = 'task',
  AUTOMATION = 'automation',
  AGENT = 'agent',
  PLUGIN = 'plugin',
  SYSTEM = 'system',
}

/** Event priority levels */
export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/** Event record stored in event history */
export interface EventRecord {
  id: string;
  event: string;
  category: EventCategory;
  payload: unknown;
  timestamp: number;
  source: string;
  correlationId?: string;
  priority: EventPriority;
}

/** Event handler function */
export type EventHandler<T = unknown> = (payload: T, record: EventRecord) => void | Promise<void>;

/** Event middleware */
export interface EventMiddleware {
  name: string;
  priority: number;
  handle(record: EventRecord, next: () => void): void;
}

/** Event filter for querying history */
export interface EventFilter {
  event?: string;
  category?: EventCategory;
  source?: string;
  correlationId?: string;
  from?: number;
  to?: number;
  limit?: number;
}

/** Event bus interface */
export interface IEventBus {
  emit(event: string, payload: unknown, options?: { priority?: EventPriority; correlationId?: string }): void;
  on<T = unknown>(event: string, handler: EventHandler<T>): Unsubscribe;
  once<T = unknown>(event: string, handler: EventHandler<T>): Unsubscribe;
  onPattern(pattern: RegExp, handler: EventHandler): Unsubscribe;
  use(middleware: EventMiddleware): void;
  removeAllListeners(event?: string): void;
  listenerCount(event: string): number;
  getHistory(filter?: EventFilter): EventRecord[];
  replay(events: EventRecord[]): void;
}

/** Event bus metrics */
export interface EventBusMetrics {
  totalEventsEmitted: number;
  totalListeners: number;
  eventCounts: Record<string, number>;
  averageProcessingTime: number;
  droppedEvents: number;
}
