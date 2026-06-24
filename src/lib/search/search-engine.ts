import { getAllChords } from '@/data/chords/chord-database';
import type { ChordEntry } from '@/data/chords/chord-schema';
import type {
  SearchQuery,
  SearchFilters,
  SearchResponse,
  SearchResult,
} from './search-types';
import { tokenize } from './search-tokenizer';
import { scoreChord, scoreByNotes } from './search-scorer';
import { extractNotes } from './search-normalizer';

/**
 * ============================================================
 * MOTOR DE BUSCA PRINCIPAL
 *
 * API pública:
 * search(input, filters?, limit?) → SearchResponse
 * ============================================================
 */

export interface SearchOptions {
  limit?: number;
  filters?: SearchFilters;
  includeSuggestions?: boolean;
}

const DEFAULT_LIMIT = 20;

export function search(input: string, options: SearchOptions = {}): SearchResponse {
  const start = performance.now();

  const {
    limit = DEFAULT_LIMIT,
    filters,
    includeSuggestions = true,
  } = options;

  const query = tokenize(input);

  // Sem input
  if (!query.normalized) {
    return {
      query,
      results: [],
      totalFound: 0,
      durationMs: 0,
    };
  }

  const allChords = applyFilters(getAllChords(), filters);
  let results: SearchResult[] = [];

  // Roteamento por modo detectado
  if (query.detectedMode === 'notes') {
    const notes = extractNotes(query.raw);
    results = allChords
      .map((c) => scoreByNotes(c, notes))
      .filter((r): r is SearchResult => r !== null);
  } else {
    results = allChords
      .map((c) => scoreChord(c, { query }))
      .filter((r): r is SearchResult => r !== null);
  }

  // Ordenação: score desc, depois complexidade asc (mais simples primeiro)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return complexityWeight(a.chord) - complexityWeight(b.chord);
  });

  const totalFound = results.length;
  const limited = results.slice(0, limit);

  const durationMs = performance.now() - start;

  const response: SearchResponse = {
    query,
    results: limited,
    totalFound,
    durationMs,
  };

  if (includeSuggestions && limited.length === 0) {
    response.suggestions = generateSuggestions(query);
  }

  return response;
}

/**
 * Aplica filtros estruturados
 */
function applyFilters(
  chords: ChordEntry[],
  filters?: SearchFilters
): ChordEntry[] {
  if (!filters) return chords;

  return chords.filter((c) => {
    if (filters.category && c.category !== filters.category) return false;
    if (filters.complexity && c.complexity !== filters.complexity) return false;
    if (filters.accessLevel && c.accessLevel !== filters.accessLevel) return false;
    if (filters.rootNote && c.root.name !== filters.rootNote) return false;
    if (filters.styles && filters.styles.length > 0) {
      const has = filters.styles.some((s) => c.styles.includes(s));
      if (!has) return false;
    }
    return true;
  });
}

/**
 * Peso de complexidade para desempate
 */
function complexityWeight(c: ChordEntry): number {
  const map: Record<string, number> = {
    beginner: 0,
    basic: 1,
    intermediate: 2,
    advanced: 3,
    master: 4,
  };
  return map[c.complexity] ?? 5;
}

/**
 * Sugestões quando não há resultado
 */
function generateSuggestions(query: SearchQuery): string[] {
  const suggestions: string[] = [];
  const q = query.normalized;

  if (q.length === 1 && /[A-G]/i.test(q)) {
    suggestions.push(`${q}`, `${q}m`, `${q}7`, `${q}maj7`);
  }

  if (q.includes('moll')) suggestions.push(q.replace('moll', 'm'));
  if (q.includes('dur')) suggestions.push(q.replace('dur', ''));

  return suggestions.slice(0, 4);
}

/**
 * Autocomplete: versão otimizada para sugestões em tempo real
 * Limita resultados rapidamente — ideal para < 50ms
 */
export function autocomplete(input: string, limit = 8): SearchResult[] {
  if (!input || input.length < 1) return [];

  const response = search(input, { limit, includeSuggestions: false });
  return response.results;
}

/**
 * Busca por ID
 */
export function searchById(id: string): ChordEntry | null {
  const allChords = getAllChords();
  return allChords.find((c) => c.id === id) || null;
}

/**
 * Busca acordes similares a um dado acorde
 */
export function findSimilar(chordId: string, limit = 6): ChordEntry[] {
  const allChords = getAllChords();
  const chord = allChords.find((c) => c.id === chordId);
  
  if (!chord) return [];

  const similar: ChordEntry[] = [];
  const seen = new Set<string>([chordId]);

  // Mesma qualidade, diferentes raízes
  for (const c of allChords) {
    if (seen.has(c.id)) continue;
    if (c.qualityId === chord.qualityId && similar.length < limit) {
      similar.push(c);
      seen.add(c.id);
    }
  }

  // Mesma raiz, diferentes qualidades
  for (const c of allChords) {
    if (seen.has(c.id)) continue;
    if (c.root.name === chord.root.name && similar.length < limit) {
      similar.push(c);
      seen.add(c.id);
    }
  }

  return similar.slice(0, limit);
}
