// ============================================================
// JARVIS - Plugin State Schema (Mongoose)
// ============================================================

import mongoose, { Schema, Document } from 'mongoose';

export interface IPluginState extends Document {
  pluginId: string;
  key: string;
  value: any;
  updatedAt: Date;
}

const pluginStateSchema = new Schema<IPluginState>(
  {
    pluginId: {
      type: String,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// Compound unique index so a plugin can only have one value per key
pluginStateSchema.index({ pluginId: 1, key: 1 }, { unique: true });

export const PluginStateModel = mongoose.model<IPluginState>('PluginState', pluginStateSchema);
