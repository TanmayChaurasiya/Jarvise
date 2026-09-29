// ============================================================
// JARVIS - Plugin Service
// ============================================================

import { BasePlugin } from '../../infrastructure/plugins/base-plugin';

class PluginServiceImpl {
  private plugins = new Map<string, BasePlugin>();

  /**
   * Registers a new plugin in the system registry.
   * @param plugin An instance of a class extending BasePlugin.
   */
  public registerPlugin(plugin: BasePlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`[PluginService] Plugin with name '${plugin.name}' is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.name, plugin);
    console.log(`[PluginService] Successfully registered plugin: ${plugin.name}`);
  }

  /**
   * Looks up and executes a plugin based on the provided action name.
   * @param action The name of the action to execute (e.g. 'open_browser').
   * @param payload The parameters for the action.
   */
  public async executeAction(action: string, payload: Record<string, any>): Promise<any> {
    const plugin = this.plugins.get(action);
    
    if (!plugin) {
      throw new Error(`[PluginService] No plugin found for action: '${action}'. Ensure it is registered.`);
    }

    try {
      console.log(`[PluginService] Executing '${action}' with payload:`, payload);
      return await plugin.execute(payload);
    } catch (error) {
      console.error(`[PluginService] Execution failed for '${action}':`, error);
      throw error;
    }
  }
}

export const PluginService = new PluginServiceImpl();
