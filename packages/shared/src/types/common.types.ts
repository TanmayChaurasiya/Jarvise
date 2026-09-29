// ============================================================
// @jarvis/shared - Common Types
// ============================================================

/** Standard API/IPC response wrapper */
export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  timestamp: number;
  requestId: string;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Pagination */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Health check */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  uptime: number;
  checks: Record<string, { status: string; latency?: number }>;
}

/** System info */
export interface SystemInfo {
  platform: string;
  arch: string;
  hostname: string;
  cpuUsage: number;
  memoryUsage: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  uptime: number;
  version: string;
}

/** Base entity */
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Unsubscribe function returned by event listeners */
export type Unsubscribe = () => void;

/** Generic callback type */
export type Callback<T = void> = (data: T) => void;

/** Deep partial utility */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Branded type for type-safe IDs */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ConversationId = Brand<string, 'ConversationId'>;
export type MemoryId = Brand<string, 'MemoryId'>;
export type TaskId = Brand<string, 'TaskId'>;
export type PluginId = Brand<string, 'PluginId'>;
export type AgentId = Brand<string, 'AgentId'>;
export type RequestId = Brand<string, 'RequestId'>;
