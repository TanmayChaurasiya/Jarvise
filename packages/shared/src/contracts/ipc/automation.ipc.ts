// ============================================================
// @jarvis/shared - Automation IPC Contracts
// ============================================================

import { z } from 'zod';

/** automation:open-app request */
export const AutoOpenAppSchema = z.object({
  appName: z.string().min(1).max(256),
  args: z.array(z.string()).optional(),
  requireConfirmation: z.boolean().default(true),
});

/** automation:close-app request */
export const AutoCloseAppSchema = z.object({
  appName: z.string().min(1).max(256),
  force: z.boolean().default(false),
});

/** automation:switch-window request */
export const AutoSwitchWindowSchema = z.object({
  windowId: z.string().min(1),
});

/** automation:open-url request */
export const AutoOpenUrlSchema = z.object({
  url: z.string().url(),
  browser: z.enum(['default', 'chrome', 'firefox', 'edge']).default('default'),
});

/** automation:open-folder request */
export const AutoOpenFolderSchema = z.object({
  path: z.string().min(1).max(1024),
});

/** automation:search-files request */
export const AutoSearchFilesSchema = z.object({
  query: z.string().min(1).max(256),
  directory: z.string().max(1024).optional(),
  extensions: z.array(z.string().max(20)).max(20).optional(),
  maxResults: z.number().int().min(1).max(100).default(20),
});

export type AutoOpenAppRequest = z.infer<typeof AutoOpenAppSchema>;
export type AutoCloseAppRequest = z.infer<typeof AutoCloseAppSchema>;
export type AutoSwitchWindowRequest = z.infer<typeof AutoSwitchWindowSchema>;
export type AutoOpenUrlRequest = z.infer<typeof AutoOpenUrlSchema>;
export type AutoOpenFolderRequest = z.infer<typeof AutoOpenFolderSchema>;
export type AutoSearchFilesRequest = z.infer<typeof AutoSearchFilesSchema>;
