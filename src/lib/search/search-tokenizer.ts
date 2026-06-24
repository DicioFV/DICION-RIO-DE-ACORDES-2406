import {
  normalizeQuery,
  looksLikeNoteList,
  looksLikeFunctionQuery,
} from './search-normalizer';
import type { SearchQuery, SearchMode } from './search-types';

/**
 * ============================================================
 * TOKENIZADOR — Quebra input em tokens significativos
 * ============================================================
 */

export function tokenize(input: string): SearchQuery {
  const raw = input;
  const normalized = normalizeQuery(input);

  let detectedMode: SearchMode = 'natural';

  if (looksLikeNoteList(raw)) {
    detectedMode = 'notes';
  } else if (looksLikeFunctionQuery(raw)) {
    detectedMode = 'function';
  } else if (/^[A-G]/.test(normalized)) {
    detectedMode = 'symbol';
  }

  // Tokens são extraídos do raw (para preservar contexto original)
  const tokens = raw
    .toLowerCase()
    .split(/[\s,;]+/)
    .filter((t) => t.length > 0);

  return {
    raw,
    normalized,
    tokens,
    detectedMode,
  };
}

/**
 * Extrai a raiz (nota) de um símbolo de acorde
 * Ex: "Cmaj7" → "C", "F#m7" → "F#"
 */
export function extractRoot(symbol: string): string | null {
  const match = symbol.match(/^([A-G](?:#|b)?)/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Extrai a qualidade de um símbolo de acorde
 * Ex: "Cmaj7" → "maj7", "F#m7" → "m7"
 */
export function extractQuality(symbol: string): string {
  const match = symbol.match(/^[A-G](?:#|b)?(.*)/i);
  return match ? match[1] : '';
}
