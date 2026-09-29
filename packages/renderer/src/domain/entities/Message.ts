// JARVIS - Message Entity

export interface Message {
  id: string;
  role: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}
