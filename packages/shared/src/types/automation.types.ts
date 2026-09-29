// ============================================================
// @jarvis/shared - Automation Types
// ============================================================

/** Supported automation actions */
export type AutomationActionType =
  | 'open_application'
  | 'close_application'
  | 'switch_window'
  | 'open_url'
  | 'open_folder'
  | 'search_files'
  | 'create_file'
  | 'delete_file'
  | 'move_file'
  | 'copy_file';

/** Automation action descriptor */
export interface AutomationAction {
  type: AutomationActionType;
  target: string;
  args?: Record<string, unknown>;
  requiresConfirmation: boolean;
  timeout?: number;
}

/** Automation execution result */
export interface AutomationExecutionResult {
  action: AutomationActionType;
  success: boolean;
  target: string;
  message: string;
  duration: number;
  error?: string;
}

/** Application registry entry */
export interface RegisteredApplication {
  name: string;
  displayName: string;
  path: string;
  icon?: string;
  category: 'development' | 'productivity' | 'communication' | 'media' | 'system' | 'other';
  launchArgs?: string[];
}

/** File operation details */
export interface FileOperation {
  type: 'create' | 'read' | 'update' | 'delete' | 'move' | 'copy';
  sourcePath: string;
  destinationPath?: string;
  isDirectory: boolean;
}

/** File search options */
export interface FileSearchOptions {
  query: string;
  rootDirectory: string;
  extensions?: string[];
  maxDepth?: number;
  maxResults?: number;
  includeHidden?: boolean;
  caseSensitive?: boolean;
}
