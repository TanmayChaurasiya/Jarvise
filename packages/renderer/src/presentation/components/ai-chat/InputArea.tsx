import React, { useState } from 'react';
import { IPCService } from '../../../application/services/ipc.service';

interface InputAreaProps {
  onSubmit: (input: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSubmit(input.trim());
    setInput('');
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      IPCService.invoke('voice:start-listening').catch(console.error);
      
      // We simulate stopping for now since the hidden renderer records for 3s
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)]">
      <div className="relative flex items-center gap-2">
        <span className="absolute left-3 text-[var(--accent-primary)] font-mono opacity-50">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command directive..."
          className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded pl-8 pr-4 py-3 text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[rgba(0,200,255,0.05)] transition-all placeholder:text-[var(--text-muted)]"
        />
        <button
          type="button"
          onClick={toggleRecording}
          className={`p-3 rounded-full border transition-all flex items-center justify-center ${
            isRecording 
              ? 'border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
              : 'border-[var(--border-subtle)] bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-white hover:border-gray-400'
          }`}
          title="Voice Command"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
        </button>
      </div>
    </form>
  );
};
