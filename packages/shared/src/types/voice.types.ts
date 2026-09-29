// ============================================================
// @jarvis/shared - Voice Types
// ============================================================

/** Voice engine types */
export type VoiceEngineType = 'web-speech' | 'whisper' | 'custom';

/** STT result */
export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  language: string;
  duration: number;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
}

/** TTS options */
export interface TTSOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

/** Wake word detection result */
export interface WakeWordDetection {
  detected: boolean;
  word: string;
  confidence: number;
  timestamp: number;
}

/** Voice command parsed result */
export interface VoiceCommand {
  raw: string;
  normalized: string;
  intent?: string;
  confidence: number;
  timestamp: number;
}

/** Voice engine configuration */
export interface VoiceEngineConfig {
  engine: VoiceEngineType;
  language: string;
  wakeWord: string;
  continuousListening: boolean;
  silenceTimeout: number;
  minConfidence: number;
}

/** Voice session state */
export interface VoiceSessionState {
  isListening: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  mode: 'push-to-talk' | 'continuous' | 'wake-word';
  wakeWordActive: boolean;
  currentTranscript: string;
  sessionDuration: number;
}
