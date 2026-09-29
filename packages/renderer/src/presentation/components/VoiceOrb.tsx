// ============================================================
// JARVIS - Voice Orb Component
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { useAgentStore, OrbState } from '../../application/store/agent.store';
import { useUIStore } from '../../application/store/ui.store';

/**
 * The central JARVIS Voice Orb.
 * Highly animated and reactive to the current agent state.
 */
export const VoiceOrb: React.FC = () => {
  const { orbState, activeAgent } = useAgentStore();
  const { toggleChat } = useUIStore();

  // Define visual states for Framer Motion
  const orbVariants = {
    idle: {
      scale: 1,
      boxShadow: '0px 0px 20px 5px rgba(0, 200, 255, 0.2)',
      backgroundColor: 'rgba(0, 100, 255, 0.1)',
      transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' as const }
    },
    listening: {
      scale: 1.1,
      boxShadow: '0px 0px 40px 10px rgba(0, 255, 100, 0.5)',
      backgroundColor: 'rgba(0, 255, 100, 0.3)',
      transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const }
    },
    thinking: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      boxShadow: '0px 0px 30px 10px rgba(150, 0, 255, 0.5)',
      backgroundColor: 'rgba(150, 0, 255, 0.3)',
      transition: { duration: 1.5, repeat: Infinity, ease: 'linear' as const }
    },
    speaking: {
      scale: [1.1, 1.3, 1.1],
      boxShadow: '0px 0px 50px 15px rgba(0, 200, 255, 0.6)',
      backgroundColor: 'rgba(0, 200, 255, 0.4)',
      transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' as const }
    },
    error: {
      scale: 1,
      boxShadow: '0px 0px 30px 10px rgba(255, 0, 0, 0.6)',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      transition: { duration: 0.2, repeat: Infinity, repeatType: 'reverse' as const }
    }
  };

  const getLabel = (state: OrbState) => {
    switch(state) {
      case 'idle': return 'Awaiting Input';
      case 'listening': return 'Listening...';
      case 'thinking': return 'Processing...';
      case 'speaking': return 'Speaking';
      case 'error': return 'System Error';
      default: return 'Online';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Interactive Orb */}
      <motion.div
        className="w-32 h-32 rounded-full cursor-pointer flex items-center justify-center border-2 border-[rgba(0,200,255,0.3)] backdrop-blur-md z-50"
        variants={orbVariants}
        animate={orbState}
        initial="idle"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-16 h-16 rounded-full bg-[rgba(0,200,255,0.8)] blur-md mix-blend-screen" />
      </motion.div>

      {/* Status HUD Text */}
      <motion.div 
        className="mt-6 text-center font-mono text-[var(--accent-primary)] tracking-widest uppercase text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="opacity-70 text-xs mb-1">
          {activeAgent ? `AGENT // ${activeAgent.toUpperCase()}` : 'SYSTEM // CORE'}
        </div>
        <div className="font-bold drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">
          [{getLabel(orbState)}]
        </div>
      </motion.div>
    </div>
  );
};
