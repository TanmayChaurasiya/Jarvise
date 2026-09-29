// JARVIS - Message Bubble Component
import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../../domain/entities/Message';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`text-xs font-mono mb-1 opacity-50 uppercase tracking-wider ${
        isUser ? 'text-[var(--text-secondary)]' : 
        isSystem ? 'text-red-400' : 'text-[var(--accent-primary)]'
      }`}>
        {message.role}
      </div>
      <div className={`px-4 py-2 rounded-lg max-w-[85%] text-sm ${
        isUser 
          ? 'bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.05)] text-[var(--text-primary)]' 
          : isSystem
          ? 'bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.2)] text-red-200 font-mono'
          : 'bg-[rgba(0,200,255,0.05)] border border-[rgba(0,200,255,0.2)] text-[var(--text-primary)] shadow-[0_0_10px_rgba(0,200,255,0.1)]'
      }`}>
        {message.content}
        {message.status === 'sending' && (
          <span className="ml-2 opacity-50 text-xs text-[var(--accent-primary)] animate-pulse">...</span>
        )}
      </div>
    </motion.div>
  );
};
