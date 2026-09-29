// ============================================================
// JARVIS - Memory Schema (Mongoose)
// ============================================================

import mongoose, { Schema, Document } from 'mongoose';
import type { MemoryEntry } from '@jarvis/shared';

// Extend MemoryEntry with backend-specific properties
export interface IMemoryEntry extends Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>, Document {
  embedding?: number[];
  context?: Record<string, any>;
}

const memorySchema = new Schema<IMemoryEntry>(
  {
    type: {
      type: String,
      required: true,
      enum: ['thought', 'fact', 'event', 'action', 'preference'],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    importance: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    source: {
      type: String,
      required: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    // For vector search / embeddings (backend only)
    embedding: {
      type: [Number],
      default: undefined,
    },
    context: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Indexes for fast retrieval
memorySchema.index({ source: 1, createdAt: -1 });
memorySchema.index({ tags: 1 });

export const MemoryModel = mongoose.model<IMemoryEntry>('Memory', memorySchema);
