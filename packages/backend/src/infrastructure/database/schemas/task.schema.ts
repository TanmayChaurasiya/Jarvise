// ============================================================
// JARVIS - Task Schema (Mongoose)
// ============================================================

import mongoose, { Schema, Document } from 'mongoose';
import type { TaskDTO } from '@jarvis/shared';

export interface ITask extends Omit<TaskDTO, 'id' | '_id' | 'createdAt' | 'updatedAt'>, Document {}

const subtaskSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
      required: true 
    },
    completedAt: { type: String },
  },
  { _id: false }
);

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    source: {
      type: String,
      required: true,
    },
    assignedAgent: {
      type: String,
      default: undefined,
    },
    subtasks: {
      type: [subtaskSchema],
      default: [],
    },
    dependencies: {
      type: [String],
      default: [],
    },
    context: {
      type: Schema.Types.Mixed,
      default: { relatedMemories: [] },
    },
    scheduledAt: { type: String },
    startedAt: { type: String },
    completedAt: { type: String },
    dueDate: { type: String },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
