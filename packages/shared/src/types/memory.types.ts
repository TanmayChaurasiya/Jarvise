// ============================================================
// @jarvis/shared - Memory Types
// ============================================================

import type { MemoryType, MemoryImportance } from './api.types.js';

/** Memory entry for frontend consumption */
export interface MemoryEntry {
  id: string;
  type: MemoryType;
  content: string;
  summary: string;
  importance: MemoryImportance;
  tags: string[];
  source: string;
  accessCount: number;
  lastAccessedAt: Date;
  createdAt: Date;
}

/** Memory search filters */
export interface MemoryFilters {
  type?: MemoryType;
  importance?: MemoryImportance;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  project?: string;
  application?: string;
}

/** Memory timeline entry */
export interface MemoryTimelineEntry {
  id: string;
  type: MemoryType;
  summary: string;
  importance: MemoryImportance;
  timestamp: Date;
  relatedEntries: string[];
}

/** Memory retrieval result with relevance scoring */
export interface MemoryRetrievalResult {
  entry: MemoryEntry;
  relevanceScore: number;
  matchType: 'semantic' | 'keyword' | 'temporal' | 'contextual';
}

/** Memory statistics */
export interface MemoryStats {
  totalEntries: number;
  byType: Record<MemoryType, number>;
  byImportance: Record<MemoryImportance, number>;
  recentAccessCount: number;
  oldestEntry: Date;
  newestEntry: Date;
}
