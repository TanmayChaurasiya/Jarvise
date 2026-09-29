// ============================================================
// JARVIS - Memory Service
// ============================================================

import { ConversationService } from './conversation.service';

class MemoryServiceImpl {
  /**
   * Fetches the recent conversation history and formats it into a string
   * that can be appended to the LLM's system prompt.
   */
  public async getFormattedContextString(limit: number = 10): Promise<string> {
    const messages = await ConversationService.getRecentMessages(limit);
    
    if (messages.length === 0) {
      return 'No previous conversation history.';
    }

    let contextString = '--- CONVERSATION HISTORY ---\n';
    
    for (const msg of messages) {
      const roleName = msg.role.toUpperCase();
      contextString += `[${roleName}]: ${msg.content}\n`;
    }
    
    contextString += '----------------------------\n';
    
    return contextString;
  }
}

export const MemoryService = new MemoryServiceImpl();
