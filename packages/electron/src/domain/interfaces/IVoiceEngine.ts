// JARVIS - Voice Engine Domain Interface
export interface IVoiceEngine {
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  processAudio(buffer: ArrayBuffer): Promise<string>;
  speak(text: string): Promise<void>;
  isListening(): boolean;
  isSpeaking(): boolean;
}
