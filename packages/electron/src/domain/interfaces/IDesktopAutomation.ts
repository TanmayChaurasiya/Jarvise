// JARVIS - Desktop Automation Domain Interface
export interface IDesktopAutomation {
  openApplication(name: string, args?: string[]): Promise<boolean>;
  closeApplication(name: string, force?: boolean): Promise<boolean>;
  switchToWindow(windowId: string): Promise<boolean>;
  openUrl(url: string, browser?: string): Promise<boolean>;
  openFolder(path: string): Promise<boolean>;
  searchFiles(query: string, directory?: string): Promise<string[]>;
  listRunningApplications(): Promise<Array<{ name: string; pid: number }>>;
}
