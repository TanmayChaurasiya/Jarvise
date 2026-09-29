// ============================================================
// JARVIS - Base Plugin Interface
// ============================================================

export abstract class BasePlugin {
  /**
   * Uniquely identifies the plugin action (e.g. 'open_browser').
   * The AgentOrchestrator routes to the plugin with the matching name.
   */
  abstract readonly name: string;

  /**
   * Executes the plugin's main functionality.
   * @param payload The parameters provided by the LLM.
   */
  abstract execute(payload: Record<string, any>): Promise<any>;
}
