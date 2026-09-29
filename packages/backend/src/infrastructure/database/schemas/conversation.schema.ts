// ============================================================
// JARVIS - Conversation Schema (Mongoose)
// ============================================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IConversation extends Document {
  title: string;
  messages: IMessage[];
  status: 'active' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ['system', 'user', 'assistant', 'tool'],
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false } // No separate _id for subdocuments to keep it clean
);

const conversationSchema = new Schema<IConversation>(
  {
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);
