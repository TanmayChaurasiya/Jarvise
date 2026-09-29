// ============================================================
// JARVIS - AI Provider Service
// ============================================================

import OpenAI from 'openai';
import { CORE_SYSTEM_PROMPT } from '../../domain/agents/system-prompts';

export interface AIProviderConfig {
  provider: 'openai' | 'ollama';
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

class AIProviderServiceImpl {
  private openai: OpenAI | null = null;
  private config: AIProviderConfig = {
    provider: 'ollama',
    model: 'llama3',
    baseUrl: 'http://127.0.0.1:11434'
  }; // Default to Ollama for local privacy

  public configure(config: AIProviderConfig) {
    this.config = config;
    if (config.provider === 'openai' && config.apiKey) {
      this.openai = new OpenAI({ apiKey: config.apiKey });
    }
  }

  public async generateResponse(input: string, contextString?: string): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(input, contextString);
    } else {
      return this.callOllama(input, contextString);
    }
  }

  private async callOpenAI(input: string, contextString?: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI client not initialized. Missing API key.');

    const systemContent = contextString 
      ? `${CORE_SYSTEM_PROMPT}\n\n${contextString}` 
      : CORE_SYSTEM_PROMPT;

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: input }
      ],
      temperature: 0.2, // Low temperature for consistent JSON
    });

    return response.choices[0]?.message.content || '{"thought": "System Failure.", "action": "none", "payload": {}}';
  }

  private async callOllama(input: string, contextString?: string): Promise<string> {
    const systemContent = contextString 
      ? `${CORE_SYSTEM_PROMPT}\n\n${contextString}` 
      : CORE_SYSTEM_PROMPT;

    const response = await fetch(`${this.config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        system: systemContent,
        prompt: input,
        stream: false,
        format: 'json' // Enforce JSON format in Ollama
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }
}

export const AIProviderService = new AIProviderServiceImpl();
