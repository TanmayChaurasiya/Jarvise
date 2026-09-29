// ============================================================
// JARVIS - Chat Panel Component
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../application/store/ui.store';
import { IPCService } from '../../application/services/ipc.service';
import { Message } from '../../domain/entities/Message';
import { MessageBubble } from './ai-chat/MessageBubble';
import { InputArea } from './ai-chat/InputArea';

export const ChatPanel: React.FC = () => {
  const { isChatOpen, setChatOpen } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'system', content: 'JARVIS Online. Awaiting protocol initialization.', timestamp: Date.now() }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = async (userMessage: string) => {
    // Add User message immediately
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMessage, timestamp: Date.now(), status: 'sending' }]);

    try {
      // Send IPC request to backend orchestrator via secure bridge
      const response = await IPCService.invoke<{ input: string }, { response: string }>('agent:query', { input: userMessage });
      
      if (response.success && response.data) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'jarvis', 
          content: response.data!.response,
          timestamp: Date.now()
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'system', 
          content: `ERROR: ${response.error?.message || 'Unknown error'}`,
          timestamp: Date.now(),
          status: 'error'
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: 'CRITICAL SYSTEM FAILURE: IPC DISCONNECTED', timestamp: Date.now(), status: 'error' }]);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-[400px] bg-[rgba(10,15,25,0.7)] backdrop-blur-xl border-l border-[var(--border-subtle)] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col z-40"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
            <h2 className="font-mono text-[var(--accent-primary)] tracking-widest text-sm uppercase">Terminal Link</h2>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-[var(--text-muted)] hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <InputArea onSubmit={handleSendMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
