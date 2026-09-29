// ============================================================
// JARVIS - Agent Orchestrator Service
// ============================================================

import { EventBus } from '../../infrastructure/event-bus/event-bus';
import { AIProviderService } from './ai-provider.service';
import { ConversationService } from './conversation.service';
import { MemoryService } from './memory.service';
import { PluginService } from './plugin.service';
import { STTService } from './stt.service';
import { TTSService } from './tts.service';
import { SystemPlugin } from '../../plugins/system-plugin';
import { CommandPlugin } from '../../plugins/command-plugin';

interface LLMResponse {
  thought: string;
  action: string;
  payload: Record<string, any>;
}

class AgentOrchestratorServiceImpl {
  constructor() {
    // Register available plugins
    const systemPlugin = new SystemPlugin();
    const commandPlugin = new CommandPlugin();
    PluginService.registerPlugin(systemPlugin);
    PluginService.registerPlugin(commandPlugin);
  }

  /**
   * Processes a user query, orchestrates LLM/tools, and emits events.
   */
  public async processQuery(input: string): Promise<{ response: string }> {
    const requestId = Date.now().toString();

    // 1. Emit 'thinking' event so the UI Orb starts spinning
    EventBus.emitEvent('agent:thinking', { requestId, stage: 'analyzing', progress: 0 });

    try {
      // 2. Fetch Context & Save User Input
      await ConversationService.addMessage('user', input);
      const contextString = await MemoryService.getFormattedContextString();

      // 3. Interface with LLM
      const rawResponse = await AIProviderService.generateResponse(input, contextString);
      let parsedResponse: LLMResponse;

      try {
        // Parse the LLM's strict JSON output
        parsedResponse = JSON.parse(rawResponse);
      } catch (e) {
        console.error('Failed to parse LLM response:', rawResponse);
        parsedResponse = {
          thought: 'I encountered an error parsing my own thought process.',
          action: 'none',
          payload: {}
        };
      }

      // 4. Handle Action Execution if action !== 'none'
      let actionResult = null;
      if (parsedResponse.action && parsedResponse.action !== 'none') {
        console.log(`[ORCHESTRATOR] Requested Action: ${parsedResponse.action}`, parsedResponse.payload);
        
        try {
          EventBus.emitEvent('agent:thinking', { requestId, stage: 'executing_action', progress: 50 });
          actionResult = await PluginService.executeAction(parsedResponse.action, parsedResponse.payload || {});
          
          // Emit success event for the Electron shell to show a notification
          EventBus.emitEvent('agent:action_success', { 
            requestId, 
            action: parsedResponse.action, 
            result: actionResult 
          });

          // Optionally append the action result to the thought so the UI knows it succeeded
          parsedResponse.thought += `\n\n[System]: ${actionResult}`;
        } catch (pluginError) {
          console.error('[ORCHESTRATOR] Plugin Execution Failed:', pluginError);
          parsedResponse.thought += `\n\n[System Error]: Failed to execute action.`;
        }
      }

      // 5. Emit 'response' event to the UI with the agent's thought
      EventBus.emitEvent('agent:response', { requestId, response: parsedResponse.thought });

      // 6. Optional: Generate TTS Audio and emit it
      const audioBuffer = await TTSService.generateAudio(parsedResponse.thought);
      if (audioBuffer) {
        // Send audio as base64 to the UI for playback
        EventBus.emitEvent('agent:audio_response', { 
          requestId, 
          audioBase64: audioBuffer.toString('base64') 
        });
      }

      // 7. Save Agent Response to Conversation
      await ConversationService.addMessage('assistant', parsedResponse.thought);

      return { response: parsedResponse.thought };
    } catch (error) {
      EventBus.emitEvent('agent:response', { requestId, response: 'Critical System Failure in AI Provider.' });
      throw error;
    }
  }

  /**
   * Processes a voice query, transcribes it, and passes it to processQuery.
   */
  public async processVoiceQuery(audioBuffer: Buffer, filename: string = 'audio.webm'): Promise<{ response: string }> {
    const requestId = Date.now().toString();
    
    // UI immediately updates to listening/transcribing state
    EventBus.emitEvent('agent:thinking', { requestId, stage: 'transcribing', progress: 0 });

    try {
      const textQuery = await STTService.transcribeAudio(audioBuffer, filename);
      console.log(`[ORCHESTRATOR] Transcribed Voice Query: "${textQuery}"`);
      
      // Pass the transcribed text into the standard pipeline
      return await this.processQuery(textQuery);
    } catch (error) {
      console.error('[ORCHESTRATOR] Voice processing failed:', error);
      EventBus.emitEvent('agent:response', { requestId, response: 'I could not process the audio.' });
      throw error;
    }
  }
}

export const AgentOrchestratorService = new AgentOrchestratorServiceImpl();
