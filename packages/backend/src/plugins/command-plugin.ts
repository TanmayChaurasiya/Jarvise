import { exec } from 'child_process';
import { BasePlugin } from '../infrastructure/plugins/base-plugin';

export interface CommandPayload {
  command: string;
}

export class CommandPlugin extends BasePlugin {
  readonly name = 'run_command';

  public async execute(payload: CommandPayload): Promise<string> {
    if (!payload.command) {
      throw new Error('Command is required.');
    }

    return new Promise((resolve, reject) => {
      exec(payload.command, (error, stdout, stderr) => {
        if (error) {
          console.error(`[CommandPlugin] Error: ${error.message}`);
          reject(`Failed to execute: ${error.message}\nStderr: ${stderr}`);
        } else {
          resolve(`Successfully executed command.\nStdout: ${stdout}`);
        }
      });
    });
  }
}
