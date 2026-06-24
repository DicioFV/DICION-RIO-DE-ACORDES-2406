/**
 * ============================================================
 * SEARCH MODULE — Public API
 * ============================================================
 */

// Types
export type {
  SearchMode,
  SearchQuery,
  SearchFilters,
  SearchResult,
  MatchType,
  SearchResponse,
} from './search-types';

// Engine
export {
  search,
  autocomplete,
  searchById,
  findSimilar,
  type SearchOptions,
} from './search-engine';

// Normalizer
export {
  normalizeQuery,
  looksLikeNoteList,
  looksLikeFunctionQuery,
  extractNotes,
  normalizeNoteName,
} from './search-normalizer';

// Tokenizer
export {
  tokenize,
  extractRoot,
  extractQuality,
} from './search-tokenizer';

// Fuzzy Matcher
export {
  levenshtein,
  similarity,
  fuzzyPrefixMatch,
  fuzzyContains,
  positionalScore,
} from './fuzzy-matcher';

// Scorer
export {
  scoreChord,
  scoreByNotes,
} from './search-scorer';
