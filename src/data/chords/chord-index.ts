import type { ChordEntry } from './chord-schema';

/**
 * ============================================================
 * ÍNDICES DE BUSCA RÁPIDA
 *
 * Estruturas Map para acesso O(1) por diversos critérios
 * ============================================================
 */

export interface ChordIndices {
  byId: Map<string, ChordEntry>;
  bySlug: Map<string, ChordEntry>;
  bySymbol: Map<string, ChordEntry>;
  byRoot: Map<string, ChordEntry[]>;
  byCategory: Map<string, ChordEntry[]>;
  byComplexity: Map<string, ChordEntry[]>;
  byQualityId: Map<string, ChordEntry[]>;
  byAccessLevel: Map<string, ChordEntry[]>;
}

export function buildIndices(chords: ChordEntry[]): ChordIndices {
  const indices: ChordIndices = {
    byId: new Map(),
    bySlug: new Map(),
    bySymbol: new Map(),
    byRoot: new Map(),
    byCategory: new Map(),
    byComplexity: new Map(),
    byQualityId: new Map(),
    byAccessLevel: new Map(),
  };

  for (const chord of chords) {
    // Índices únicos
    indices.byId.set(chord.id, chord);
    indices.bySlug.set(chord.slug, chord);
    
    // Símbolo principal
    if (!indices.bySymbol.has(chord.symbol)) {
      indices.bySymbol.set(chord.symbol, chord);
    }

    // Aliases de símbolo
    for (const alt of chord.symbolAlternatives) {
      if (!indices.bySymbol.has(alt)) {
        indices.bySymbol.set(alt, chord);
      }
    }

    // Índices de lista
    pushTo(indices.byRoot, chord.root.name, chord);
    pushTo(indices.byCategory, chord.category, chord);
    pushTo(indices.byComplexity, chord.complexity, chord);
    pushTo(indices.byQualityId, chord.qualityId, chord);
    pushTo(indices.byAccessLevel, chord.accessLevel, chord);
  }

  return indices;
}

function pushTo<T>(map: Map<string, T[]>, key: string, value: T): void {
  if (!map.has(key)) map.set(key, []);
  map.get(key)!.push(value);
}

/**
 * Busca por texto em múltiplos campos
 */
export function searchInIndices(
  indices: ChordIndices,
  query: string,
  chords: ChordEntry[]
): ChordEntry[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  // Busca exata por símbolo
  const exactSymbol = indices.bySymbol.get(query);
  if (exactSymbol) return [exactSymbol];

  // Busca exata por ID
  const exactId = indices.byId.get(normalizedQuery);
  if (exactId) return [exactId];

  // Busca parcial
  const results: ChordEntry[] = [];
  const seen = new Set<string>();

  for (const chord of chords) {
    if (seen.has(chord.id)) continue;

    const matchesSymbol = chord.symbol.toLowerCase().includes(normalizedQuery);
    const matchesDisplay = chord.displayName.toLowerCase().includes(normalizedQuery);
    const matchesRoot = chord.root.name.toLowerCase() === normalizedQuery;
    const matchesQuality = chord.qualityName.toLowerCase().includes(normalizedQuery);

    if (matchesSymbol || matchesDisplay || matchesRoot || matchesQuality) {
      results.push(chord);
      seen.add(chord.id);
    }
  }

  // Ordena por relevância (símbolo exato primeiro)
  results.sort((a, b) => {
    const aExact = a.symbol.toLowerCase() === normalizedQuery ? 0 : 1;
    const bExact = b.symbol.toLowerCase() === normalizedQuery ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    const aStartsWith = a.symbol.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
    const bStartsWith = b.symbol.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
    return aStartsWith - bStartsWith;
  });

  return results.slice(0, 50);
}
