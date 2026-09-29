// ============================================================
// @jarvis/shared - Agent Types
// ============================================================

/** Agent role identifiers */
export type AgentRole =
  | 'desktop'
  | 'coding'
  | 'research'
  | 'vision'
  | 'memory'
  | 'file'
  | 'orchestrator';

/** Intent classification */
export interface IntentClassification {
  type: string;
  confidence: number;
  parameters: Record<string, unknown>;
  suggestedAgent: AgentRole;
}

/** Agent capability descriptor */
export interface AgentCapability {
  name: string;
  description: string;
  intents: string[];
  tools: string[];
}

/** Agent registration */
export interface AgentRegistration {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  priority: number;
}

/** Agent execution context */
export interface AgentExecutionContext {
  requestId: string;
  conversationId?: string;
  intent: IntentClassification;
  userInput: string;
  memories: Array<{
    content: string;
    relevance: number;
  }>;
  activeWindow?: string;
  screenContext?: string;
  previousMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/** Agent execution result */
export interface AgentExecutionResult {
  success: boolean;
  response: string;
  actions: Array<{
    type: string;
    label: string;
    payload: Record<string, unknown>;
    requiresConfirmation: boolean;
    executed: boolean;
  }>;
  suggestions: string[];
  metadata: {
    processingTime: number;
    tokensUsed: { prompt: number; completion: number };
    toolsUsed: string[];
    memoriesAccessed: number;
  };
}

/** Tool definition for agents */
export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required: boolean;
    enum?: string[];
  }>;
  handler: string;
  requiresConfirmation: boolean;
}

/** Orchestrator planning result */
export interface TaskPlan {
  steps: TaskPlanStep[];
  estimatedTime: number;
  requiredAgents: AgentRole[];
  requiredTools: string[];
}

export interface TaskPlanStep {
  order: number;
  agent: AgentRole;
  action: string;
  description: string;
  dependencies: number[];
  estimatedTime: number;
}
