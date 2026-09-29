// ============================================================
// JARVIS - Agent IPC Handler (Electron)
// ============================================================

import { ServiceResponse } from '@jarvis/shared';

/**
 * Handles 'agent:query' from the React frontend and forwards it 
 * to the Express Backend Orchestrator via HTTP.
 */
export async function handleAgentQuery(
  _event: Electron.IpcMainInvokeEvent,
  payload: { input: string }
): Promise<ServiceResponse<{ response: string }>> {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/agent/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }

    const json = await response.json();
    return {
      success: true,
      data: json.data,
      timestamp: Date.now(),
      requestId: ''
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'AGENT_QUERY_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: Date.now(),
      requestId: ''
    };
  }
}
