// ============================================================
// @jarvis/shared - Memory IPC Contracts
// ============================================================

import { z } from 'zod';

const MemoryTypeEnum = z.enum([
  'conversation', 'task', 'preference', 'project', 'command', 'file_access', 'screen_context',
]);

const MemoryImportanceEnum = z.enum(['low', 'medium', 'high', 'critical']);

/** memory:store request */
export const MemoryStoreSchema = z.object({
  type: MemoryTypeEnum,
  content: z.string().min(1).max(10000),
  summary: z.string().min(1).max(1000),
  importance: MemoryImportanceEnum.default('medium'),
  tags: z.array(z.string().max(50)).max(20).optional(),
  source: z.string().min(1).max(100),
});

/** memory:search request */
export const MemorySearchSchema = z.object({
  query: z.string().min(1).max(500),
  type: MemoryTypeEnum.optional(),
  importance: MemoryImportanceEnum.optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

/** memory:get-recent request */
export const MemoryGetRecentSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  type: MemoryTypeEnum.optional(),
});

export type MemoryStoreRequest = z.infer<typeof MemoryStoreSchema>;
export type MemorySearchIpcRequest = z.infer<typeof MemorySearchSchema>;
export type MemoryGetRecentRequest = z.infer<typeof MemoryGetRecentSchema>;
