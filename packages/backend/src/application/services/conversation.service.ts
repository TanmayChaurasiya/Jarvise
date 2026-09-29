// ============================================================
// JARVIS - Conversation Service
// ============================================================

import { ConversationModel, IMessage, IConversation } from '../../infrastructure/database/schemas/conversation.schema';

class ConversationServiceImpl {
  /**
   * Retrieves or creates the default active conversation.
   * For simplicity in Phase 1, JARVIS uses a single active conversation context.
   */
  public async getActiveConversation(): Promise<IConversation> {
    let conversation = await ConversationModel.findOne({ status: 'active' });
    if (!conversation) {
      conversation = await ConversationModel.create({
        title: 'Active Session',
        messages: [],
        status: 'active'
      });
    }
    return conversation;
  }

  /**
   * Adds a message to the active conversation.
   */
  public async addMessage(role: IMessage['role'], content: string): Promise<void> {
    const conversation = await this.getActiveConversation();
    
    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    await conversation.save();
  }

  /**
   * Fetches the most recent messages from the active conversation to use as context.
   */
  public async getRecentMessages(limit: number = 10): Promise<IMessage[]> {
    const conversation = await this.getActiveConversation();
    // Return the last N messages
    return conversation.messages.slice(-limit);
  }
}

export const ConversationService = new ConversationServiceImpl();
