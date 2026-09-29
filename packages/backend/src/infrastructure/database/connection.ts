// ============================================================
// JARVIS - MongoDB Connection
// ============================================================

import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/jarvis';

/**
 * Bootstraps the connection to the local MongoDB database.
 */
export async function connectDatabase(uri: string = DEFAULT_URI): Promise<void> {
  try {
    // Configure global mongoose settings
    mongoose.set('strictQuery', true);
    
    // Virtuals globally included in JSON/Object conversions (mapping _id -> id)
    mongoose.set('toJSON', {
      virtuals: true,
      transform: (_: any, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    console.log(`[Database] Successfully connected to MongoDB at ${uri}`);
  } catch (error) {
    console.error(`[Database] Failed to connect to MongoDB:`, error);
    // In production, you might not want to exit the entire app if the DB is down,
    // but for JARVIS, the DB is critical for Memory/Agents.
    throw error;
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB connection lost');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('[Database] MongoDB reconnected');
  });
}

/**
 * Gracefully closes the database connection.
 */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] Disconnected');
  }
}
