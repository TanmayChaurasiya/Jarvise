// ============================================================
// @jarvis/shared - Vision IPC Contracts
// ============================================================

import { z } from 'zod';

/** vision:capture-window request */
export const VisionCaptureWindowSchema = z.object({
  windowId: z.string().min(1),
  format: z.enum(['png', 'jpeg']).default('png'),
  quality: z.number().min(0.1).max(1.0).default(0.9),
});

/** vision:analyze request */
export const VisionAnalyzeSchema = z.object({
  captureData: z.string().min(1), // base64 encoded
  options: z.object({
    performOCR: z.boolean().default(true),
    detectUI: z.boolean().default(true),
    detectCode: z.boolean().default(true),
    detectErrors: z.boolean().default(true),
    maxDetailLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  }).optional(),
});

export type VisionCaptureWindowRequest = z.infer<typeof VisionCaptureWindowSchema>;
export type VisionAnalyzeRequest = z.infer<typeof VisionAnalyzeSchema>;
