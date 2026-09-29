# JARVIS IPC API Documentation

The Inter-Process Communication (IPC) layer bridges the React renderer with the Electron main process.

## Security
- Raw IPC APIs are NOT exposed to React.
- React uses `window.jarvis` provided via `contextBridge`.
- All payloads are validated using Zod schemas.
