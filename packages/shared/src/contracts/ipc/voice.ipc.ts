// ============================================================
// @jarvis/shared - Voice IPC Contracts
// ============================================================

import { z } from 'zod';

/** voice:process-audio request */
export const VoiceProcessAudioSchema = z.object({
  buffer: z.instanceof(ArrayBuffer),
  sampleRate: z.number().int().min(8000).max(48000).default(16000),
  channels: z.number().int().min(1).max(2).default(1),
});

/** voice:set-mode request */
export const VoiceSetModeSchema = z.object({
  mode: z.enum(['push-to-talk', 'continuous', 'wake-word']),
});

export type VoiceProcessAudioRequest = z.infer<typeof VoiceProcessAudioSchema>;
export type VoiceSetModeRequest = z.infer<typeof VoiceSetModeSchema>;
