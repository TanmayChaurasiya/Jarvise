// ============================================================
// JARVIS - Speech-To-Text (STT) Service
// ============================================================

import OpenAI, { toFile } from 'openai';

class STTServiceImpl {
  private openai: OpenAI | null = null;

  public configure(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * Transcribes an audio buffer using OpenAI Whisper API.
   * If not configured or missing key, returns a mock transcription for testing.
   */
  public async transcribeAudio(audioBuffer: Buffer, filename: string = 'audio.webm'): Promise<string> {
    if (!this.openai) {
      console.warn('[STT] OpenAI not configured. Returning mock transcription.');
      // Mock transcription for local testing without API key
      return "What's the weather like today?";
    }

    try {
      // OpenAI requires a File-like object
      const file = await toFile(audioBuffer, filename);
      
      const response = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
      });

      return response.text;
    } catch (error) {
      console.error('[STT] Transcription failed:', error);
      throw new Error('Failed to transcribe audio.');
    }
  }
}

export const STTService = new STTServiceImpl();
