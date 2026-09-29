# JARVIS System Overview

This document outlines the high-level architecture of JARVIS, a locally-hosted, plugin-driven AI Desktop Assistant.

## Core Tenets
1. **Local First**: Prioritizes local processing (Ollama) with cloud fallbacks (OpenAI).
2. **Security by Design**: Context isolation, strict IPC contracts, and granular permissions.
3. **Extensibility**: Everything is a plugin.
4. **Agent Orchestration**: Multi-agent system coordinated by a central orchestrator.

## Architectural Layers
- **Presentation**: React 19, Framer Motion, Tailwind (Frontend)
- **Application**: Electron main process, Express backend
- **Domain**: Business logic, intents, orchestration
- **Infrastructure**: MongoDB, AI Providers, OS Integration
