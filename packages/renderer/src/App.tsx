// ============================================================
// JARVIS - Root React Application Layout
// ============================================================

import React, { useEffect } from 'react';
import { VoiceOrb } from './presentation/components/VoiceOrb';
import { ChatPanel } from './presentation/components/ChatPanel';
import { useAgentStore } from './application/store/agent.store';
import { IPCService } from './application/services/ipc.service';

export const App: React.FC = () => {
  const { setOrbState } = useAgentStore();

  useEffect(() => {
    // ── Global IPC Event Listeners ─────────────────────────────
    
    // Listen for agent thinking state pushed from Electron
    const cleanupThinking = IPCService.on('event:agent-thinking', (payload: any) => {
      console.log('Agent Thinking:', payload);
      setOrbState('thinking');
    });

    // Listen for voice transcription
    const cleanupVoice = IPCService.on('event:voice-transcript', (payload: any) => {
      console.log('Voice Transcript:', payload);
      if (payload.isFinal) {
        setOrbState('thinking');
      } else {
        setOrbState('listening');
      }
    });
    
    // Listen for agent response
    const cleanupResponse = IPCService.on('event:agent-response', () => {
      setOrbState('speaking');
      // Revert to idle after short delay simulating speech ends
      setTimeout(() => setOrbState('idle'), 2000); 
    });

    return () => {
      // Clean up IPC subscriptions on unmount
      cleanupThinking();
      cleanupVoice();
      cleanupResponse();
    };
  }, [setOrbState]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent text-[var(--text-primary)] font-sans relative">
      
      {/* Background Holographic Grid Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `linear-gradient(rgba(0, 200, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.1) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
             WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }} 
      />

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {/* Pointer events enabled only on the Orb itself */}
        <div className="pointer-events-auto">
          <VoiceOrb />
        </div>
      </div>

      {/* Slide-out Interface Panels */}
      <ChatPanel />

      {/* System Tray Overlay (Optional) */}
      <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-[var(--text-muted)] opacity-50 uppercase tracking-widest pointer-events-none">
        JARVIS OS // BUILD 0.1.0 // ONLINE
      </div>
    </div>
  );
};
