// ============================================================
// JARVIS - Backend Event Bus
// ============================================================

import { EventEmitter } from 'events';

/**
 * Singleton EventBus using Node's native EventEmitter.
 * Used for decoupled communication between Agents, Services, and IPC.
 */
class LocalEventBus extends EventEmitter {
  constructor() {
    super();
    // Increase max listeners since many plugins/agents may subscribe to core events
    this.setMaxListeners(100);
  }

  /**
   * Strongly typed emit (can be expanded with exact types from @jarvis/shared)
   */
  public emitEvent<T>(eventName: string, payload: T): boolean {
    return this.emit(eventName, payload);
  }

  /**
   * Strongly typed listener
   */
  public onEvent<T>(eventName: string, listener: (payload: T) => void): this {
    return this.on(eventName, listener);
  }
}

// Export a singleton instance
export const EventBus = new LocalEventBus();
