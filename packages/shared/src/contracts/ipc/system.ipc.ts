// ============================================================
// @jarvis/shared - System IPC Contracts
// ============================================================

import { z } from 'zod';

/** system:request-permission request */
export const SystemRequestPermissionSchema = z.object({
  permission: z.string().min(1).max(100),
  reason: z.string().min(1).max(500).optional(),
});

/** plugin:enable request */
export const PluginEnableSchema = z.object({
  pluginId: z.string().min(1).max(100),
});

/** plugin:disable request */
export const PluginDisableSchema = z.object({
  pluginId: z.string().min(1).max(100),
});

/** plugin:get-status request */
export const PluginGetStatusSchema = z.object({
  pluginId: z.string().min(1).max(100),
});

/** agent:query request */
export const AgentQuerySchema = z.object({
  text: z.string().min(1).max(5000),
  context: z.object({
    conversationId: z.string().optional(),
    activeWindow: z.string().optional(),
    screenCapture: z.string().optional(),
  }).optional(),
});

/** agent:cancel request */
export const AgentCancelSchema = z.object({
  requestId: z.string().min(1),
});

export type SystemRequestPermissionRequest = z.infer<typeof SystemRequestPermissionSchema>;
export type PluginEnableRequest = z.infer<typeof PluginEnableSchema>;
export type PluginDisableRequest = z.infer<typeof PluginDisableSchema>;
export type PluginGetStatusRequest = z.infer<typeof PluginGetStatusSchema>;
export type AgentQueryRequest = z.infer<typeof AgentQuerySchema>;
export type AgentCancelRequest = z.infer<typeof AgentCancelSchema>;
