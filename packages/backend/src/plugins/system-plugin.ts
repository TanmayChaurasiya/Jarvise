// ============================================================
// JARVIS - System Plugin
// ============================================================

import { exec } from 'child_process';
import { BasePlugin } from '../infrastructure/plugins/base-plugin';

export interface OpenBrowserPayload {
  url: string;
}

export class SystemPlugin extends BasePlugin {
  readonly name = 'open_browser';

  public async execute(payload: OpenBrowserPayload): Promise<string> {
    if (!payload.url) {
      throw new Error('URL is required to open the browser.');
    }

    return new Promise((resolve, reject) => {
      // Determines the OS-specific command to open a URL
      const command = process.platform === 'win32' 
        ? `start "" "${payload.url}"`
        : process.platform === 'darwin'
        ? `open "${payload.url}"`
        : `xdg-open "${payload.url}"`;

      exec(command, (error) => {
        if (error) {
          console.error(`[SystemPlugin] Error opening browser: ${error.message}`);
          reject(`Failed to open browser: ${error.message}`);
        } else {
          resolve(`Successfully opened browser to ${payload.url}`);
        }
      });
    });
  }
}
