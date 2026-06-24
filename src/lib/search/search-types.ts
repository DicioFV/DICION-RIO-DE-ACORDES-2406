import type { ChordEntry } from '@/data/chords/chord-schema';

/**
 * ============================================================
 * TIPOS DO SISTEMA DE BUSCA
 * ============================================================
 */

export type SearchMode =
  | 'symbol' // "Cmaj7"
  | 'notes' // "C E G B"
  | 'function' // "dominante de Sol"
  | 'natural'; // detecção automática

export interface SearchQuery {
  raw: string; // Input bruto
  normalized: string; // Limpo, lowercase
  tokens: string[]; // Tokenizado
  detectedMode: SearchMode;
}

export interface SearchFilters {
  instrument?: string;
  category?: string;
  complexity?: string;
  accessLevel?: string;
  rootNote?: string;
  styles?: string[];
}

export interface SearchResult {
  chord: ChordEntry;
  score: number; // 0-1
  matchType: MatchType;
  matchedFields: string[]; // ['symbol', 'displayName', ...]
  highlight?: string; // trecho destacado
}

export type MatchType =
  | 'exact' // Match perfeito
  | 'symbol-alt' // Match em alias
  | 'fuzzy' // Match aproximado
  | 'notes' // Match por notas
  | 'function' // Match por função
  | 'partial'; // Match parcial

export interface SearchResponse {
  query: SearchQuery;
  results: SearchResult[];
  totalFound: number;
  durationMs: number;
  suggestions?: string[]; // "Você quis dizer...?"
}
