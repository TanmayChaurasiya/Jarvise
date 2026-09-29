// ============================================================
// JARVIS - Text-To-Speech (TTS) Service
// ============================================================

import OpenAI from 'openai';

class TTSServiceImpl {
  private openai: OpenAI | null = null;

  public configure(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * Generates audio from text using OpenAI TTS API.
   * If not configured, returns a null buffer.
   */
  public async generateAudio(text: string): Promise<Buffer | null> {
    if (!this.openai) {
      console.warn('[TTS] OpenAI not configured. Skipping TTS generation.');
      return null;
    }

    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'onyx', // A good deep voice for JARVIS
        input: text,
      });

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('[TTS] Audio generation failed:', error);
      return null;
    }
  }
}

export const TTSService = new TTSServiceImpl();
