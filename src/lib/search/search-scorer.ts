import type { ChordEntry } from '@/data/chords/chord-schema';
import type { SearchQuery, SearchResult, MatchType } from './search-types';
import { similarity } from './fuzzy-matcher';

/**
 * ============================================================
 * SCORER — Calcula pontuação de relevância para cada acorde
 * ============================================================
 */

interface ScoreContext {
  query: SearchQuery;
}

/**
 * Pontua um acorde contra a query.
 * Retorna null se não há match relevante.
 */
export function scoreChord(
  chord: ChordEntry,
  ctx: ScoreContext
): SearchResult | null {
  const { query } = ctx;
  const q = query.normalized;

  if (!q) return null;

  let bestScore = 0;
  let matchType: MatchType = 'partial';
  const matchedFields: string[] = [];

  // 1. Match exato no símbolo (peso máximo)
  if (chord.symbol.toLowerCase() === q.toLowerCase()) {
    return {
      chord,
      score: 1.0,
      matchType: 'exact',
      matchedFields: ['symbol'],
    };
  }

  // 2. Match em aliases
  for (const alt of chord.symbolAlternatives) {
    if (alt.toLowerCase() === q.toLowerCase()) {
      return {
        chord,
        score: 0.98,
        matchType: 'symbol-alt',
        matchedFields: ['symbolAlternatives'],
      };
    }
  }

  // 3. Prefixo no símbolo (excelente para autocomplete)
  if (chord.symbol.toLowerCase().startsWith(q.toLowerCase())) {
    const ratio = q.length / chord.symbol.length;
    const score = 0.85 + ratio * 0.1; // 0.85 a 0.95
    if (score > bestScore) {
      bestScore = score;
      matchType = 'partial';
      matchedFields.push('symbol-prefix');
    }
  }

  // 4. Fuzzy match no símbolo
  const symbolSim = similarity(q.toLowerCase(), chord.symbol.toLowerCase());
  if (symbolSim >= 0.75) {
    const score = 0.6 + symbolSim * 0.25;
    if (score > bestScore) {
      bestScore = score;
      matchType = 'fuzzy';
      matchedFields.push('symbol-fuzzy');
    }
  }

  // 5. Match no slug (busca em português)
  if (chord.slug.includes(q.toLowerCase())) {
    const score = 0.75;
    if (score > bestScore) {
      bestScore = score;
      matchType = 'partial';
      matchedFields.push('slug');
    }
  }

  // 6. Match no displayName (português)
  const displayLower = chord.displayName.toLowerCase();
  if (displayLower.includes(q.toLowerCase())) {
    const score = 0.7;
    if (score > bestScore) {
      bestScore = score;
      matchedFields.push('displayName');
    }
  }

  // 7. Match em nomes de notas (mostra acordes que CONTÊM essa nota)
  const noteNames = chord.notes.map((n) => n.name.toLowerCase());
  if (noteNames.includes(q.toLowerCase())) {
    const score = 0.4;
    if (score > bestScore) {
      bestScore = score;
      matchedFields.push('notes');
    }
  }

  // 8. Match na qualidade
  if (chord.qualityId.toLowerCase().includes(q.toLowerCase())) {
    const score = 0.5;
    if (score > bestScore) {
      bestScore = score;
      matchedFields.push('qualityId');
    }
  }

  if (bestScore < 0.3) return null;

  return {
    chord,
    score: bestScore,
    matchType,
    matchedFields,
  };
}

/**
 * Mapa de notas para pitch class
 */
const NOTE_TO_PITCH: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11,
};

/**
 * Pontuação especial para busca por LISTA DE NOTAS
 */
export function scoreByNotes(
  chord: ChordEntry,
  noteNames: string[]
): SearchResult | null {
  if (noteNames.length === 0) return null;

  const chordPitches = new Set(chord.notes.map((n) => n.pitchClass));
  
  const queryPitches = new Set(
    noteNames
      .map((name) => NOTE_TO_PITCH[name] ?? -1)
      .filter((p) => p >= 0)
  );

  if (queryPitches.size === 0) return null;

  let matched = 0;
  for (const p of queryPitches) {
    if (chordPitches.has(p)) matched++;
  }

  const completeness = matched / queryPitches.size;
  const purity = matched / chordPitches.size;

  // Match perfeito: tem todas e somente as notas pedidas
  if (completeness === 1 && purity === 1) {
    return {
      chord,
      score: 1.0,
      matchType: 'notes',
      matchedFields: ['notes-exact'],
    };
  }

  if (completeness >= 0.8) {
    return {
      chord,
      score: completeness * 0.7 + purity * 0.2,
      matchType: 'notes',
      matchedFields: ['notes-partial'],
    };
  }

  return null;
}
