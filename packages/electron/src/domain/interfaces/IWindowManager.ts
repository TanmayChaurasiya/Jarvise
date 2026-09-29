// JARVIS - Window Manager Domain Interface
import type { WindowInfo } from '@jarvis/shared';

export interface IWindowManager {
  getActiveWindow(): Promise<WindowInfo>;
  listWindows(): Promise<WindowInfo[]>;
  focusWindow(windowId: string): Promise<boolean>;
  minimizeWindow(windowId: string): Promise<boolean>;
  maximizeWindow(windowId: string): Promise<boolean>;
  closeWindow(windowId: string): Promise<boolean>;
}
