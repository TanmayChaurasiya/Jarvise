// ============================================================
// JARVIS - Electron Main Process Entry Point
// ============================================================

import { app, BrowserWindow, globalShortcut, Notification, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { IPCRouter } from './application/handlers/ipc-router.js';
// Need to use http module or a fetch alternative if EventSource is not native in Node yet.
// Electron has net module, or we can just use native Node fetch (which might not support SSE streaming easily).
// For simplicity, we can use the 'eventsource' package, but since we didn't install it,
// we can implement a simple HTTP request with chunked reading.
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let hiddenVoiceWindow: BrowserWindow | null = null;

export function triggerVoiceListening() {
  if (hiddenVoiceWindow) {
    hiddenVoiceWindow.webContents.send('start-listening');
  }
}

async function createHiddenVoiceWindow() {
  hiddenVoiceWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true, // Required for IPC in the hidden trusted window
      contextIsolation: false,
    }
  });

  // Determine correct path for the hidden HTML file based on whether we are in dev or prod
  const isDev = !app.isPackaged;
  const htmlPath = isDev
    ? path.join(__dirname, '../src/hidden-renderer.html')
    : path.join(__dirname, 'hidden-renderer.html');

  // Load the hidden HTML file
  await hiddenVoiceWindow.loadFile(htmlPath);
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'JARVIS AI Assistant',
    backgroundColor: '#0c1018', // Matches --bg-primary
    show: false, // Don't show until ready-to-show
    webPreferences: {
      // ────────────────────────────────────────────────────────
      // CRITICAL SECURITY DEFAULTS
      // ────────────────────────────────────────────────────────
      nodeIntegration: false,        // Absolutely NO node in renderer
      contextIsolation: true,        // Enforce context isolation
      sandbox: true,                 // Enable OS-level sandbox
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,             // Enforce CORS/CSP
      allowRunningInsecureContent: false,
      // ────────────────────────────────────────────────────────
    },
  });

  // Hide menu bar for a clean aesthetic
  mainWindow.setMenuBarVisibility(false);

  // Load the React app
  // In dev mode, this would load localhost:5173. 
  // For scaffolding purposes, we'll assume production path or a placeholder dev check.
  const isDevWindow = !app.isPackaged;

  if (isDevWindow) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In actual production, this points to the built renderer dist folder
    await mainWindow.loadFile(path.join(__dirname, '../../renderer/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Connects to the Express backend SSE endpoint and forwards events to the renderer.
 */
function connectToBackendSSE() {
  const req = http.request('http://127.0.0.1:3001/api/events', {
    method: 'GET',
    headers: { 'Accept': 'text/event-stream' }
  }, (res) => {
    let buffer = '';
    res.on('data', (chunk) => {
      buffer += chunk.toString();
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || ''; // Keep the incomplete chunk

      for (const msg of messages) {
        if (!msg.trim()) continue;
        const lines = msg.split('\n');
        let eventType = '';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) eventType = line.substring(7).trim();
          if (line.startsWith('data: ')) dataStr = line.substring(6).trim();
        }

        if (eventType && dataStr && mainWindow) {
          try {
            const payload = JSON.parse(dataStr);

            // Handle Notification directly in the Main Process
            if (eventType === 'agent:action_success') {
              if (Notification.isSupported()) {
                new Notification({
                  title: 'JARVIS Action Completed',
                  body: `Successfully executed: ${payload.action}`
                }).show();
              }
            }

            // Prefix the event name with 'event:' since the backend just sends 'agent:thinking' etc.
            // Wait, the backend already prefixes it if needed? No, backend sends 'agent:thinking'.
            // The renderer expects 'event:agent-thinking'. Let's map it.
            const channel = eventType.replace(':', '-');
            mainWindow.webContents.send(`event:${channel}`, payload);
          } catch (e) {
            console.error('[SSE] Parse error:', e);
          }
        }
      }
    });
  });

  req.on('error', (err) => {
    console.error('[SSE] Connection error:', err.message);
    // Retry connection after 3 seconds
    setTimeout(connectToBackendSSE, 3000);
  });

  req.end();
}

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus existing window if a second instance tries to launch
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // 1. Initialize IPC Security Router
    IPCRouter.initialize();

    // 2. Create UI Window & Hidden Voice Engine
    createWindow();
    createHiddenVoiceWindow();

    // 3. Connect to Backend SSE Events
    connectToBackendSSE();

    // 4. Handle Voice Capture from Hidden Renderer
    ipcMain.on('voice-buffer-ready', async (_event, buffer: Buffer) => {
      try {
        const audioBase64 = buffer.toString('base64');
        const req = http.request('http://127.0.0.1:3001/api/agent/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }, (_res) => {
          // Handle response if needed, otherwise SSE handles UI updates
        });

        req.on('error', (err) => console.error('[Voice] Failed to send audio to backend:', err));
        req.write(JSON.stringify({ audioBase64 }));
        req.end();
      } catch (e) {
        console.error('[Voice] Error processing audio buffer:', e);
      }
    });

    ipcMain.on('voice-error', (_event, error) => {
      console.error('[HiddenRenderer Voice Error]:', error);
    });

    // 5. Register Global Shortcut
    globalShortcut.register('Alt+Shift+J', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
