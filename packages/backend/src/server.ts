// ============================================================
// JARVIS - Express Server
// ============================================================

import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './infrastructure/database/connection';
import { EventBus } from './infrastructure/event-bus/event-bus';
import { AgentOrchestratorService } from './application/services/agent-orchestrator.service';
import { AIProviderService } from './application/services/ai-provider.service';
import { STTService } from './application/services/stt.service';
import { TTSService } from './application/services/tts.service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env['PORT'] || 3001;

// ── Security & Middleware ──────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Allow local React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '50mb' })); // Large limit for images/audio

// Loopback protection middleware: Restrict access to localhost only
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (ip === '::1' || ip === '127.0.0.1' || ip?.includes('127.0.0.1')) {
    next();
  } else {
    console.warn(`[Security] Blocked external request from ${ip}`);
    res.status(403).json({ error: 'Forbidden: Loopback only' });
  }
});

// ── Server-Sent Events (SSE) for Electron Main Process ─────────
app.get('/api/events', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Helper to send events
  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Wire up EventBus listeners
  const onThinking = (data: any) => sendEvent('agent:thinking', data);
  const onResponse = (data: any) => sendEvent('agent:response', data);
  const onTranscript = (data: any) => sendEvent('voice:transcript', data);
  const onActionSuccess = (data: any) => sendEvent('agent:action_success', data);
  const onAudioResponse = (data: any) => sendEvent('agent:audio_response', data);

  EventBus.onEvent('agent:thinking', onThinking);
  EventBus.onEvent('agent:response', onResponse);
  EventBus.onEvent('voice:transcript', onTranscript);
  EventBus.onEvent('agent:action_success', onActionSuccess);
  EventBus.onEvent('agent:audio_response', onAudioResponse);

  // Send an initial connected event
  sendEvent('system:connected', { status: 'SSE Ready' });

  // Cleanup on disconnect
  req.on('close', () => {
    EventBus.removeListener('agent:thinking', onThinking);
    EventBus.removeListener('agent:response', onResponse);
    EventBus.removeListener('voice:transcript', onTranscript);
    EventBus.removeListener('agent:action_success', onActionSuccess);
    EventBus.removeListener('agent:audio_response', onAudioResponse);
  });
});

// ── API Routes ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/agent/query', async (req, res, next) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      res.status(400).json({ success: false, error: { message: 'Invalid input' } });
      return;
    }
    const result = await AgentOrchestratorService.processQuery(input);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

app.post('/api/agent/voice', async (req, res, next) => {
  try {
    const { audioBase64 } = req.body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ success: false, error: { message: 'Invalid audio input' } });
      return;
    }
    const buffer = Buffer.from(audioBase64, 'base64');
    const result = await AgentOrchestratorService.processVoiceQuery(buffer);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Fallback error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Express] Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal Server Error'
    }
  });
});

// ── Bootstrap ──────────────────────────────────────────────────
async function bootstrap() {
  try {
    console.log('[Bootstrap] Initializing backend...');
    
    // Connect to MongoDB
    await connectDatabase();
    
    // Configure AI Provider based on .env
    const useOpenAI = !!process.env['OPENAI_API_KEY'];
    AIProviderService.configure({
      provider: useOpenAI ? 'openai' : 'ollama',
      model: useOpenAI ? (process.env['OPENAI_MODEL'] || 'gpt-4o') : (process.env['OLLAMA_MODEL'] || 'llama3'),
      apiKey: process.env['OPENAI_API_KEY'],
      baseUrl: process.env['OLLAMA_BASE_URL'] || 'http://127.0.0.1:11434'
    });
    console.log(`[Bootstrap] Configured AI Provider: ${useOpenAI ? 'OpenAI' : 'Ollama'}`);

    // Configure Voice Services
    STTService.configure(process.env['OPENAI_API_KEY']);
    TTSService.configure(process.env['OPENAI_API_KEY']);
    console.log('[Bootstrap] Configured Voice Services (STT/TTS).');
    
    // Start Express
    app.listen(PORT, () => {
      console.log(`[Express] Backend server running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('[Bootstrap] Failed to initialize backend:', error);
    process.exit(1);
  }
}

bootstrap();
