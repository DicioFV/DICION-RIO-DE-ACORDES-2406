import type { ChordEntry, DatabaseStats } from './chord-schema';
import { generateBaseChords } from './generators/base-chords-generator';
import { generateAllSlashChords } from './generators/slash-chords-generator';
import { generatePolychords } from './generators/polychords-generator';
import { enrichChords } from './generators/metadata-enricher';
import { buildIndices, searchInIndices, type ChordIndices } from './chord-index';

/**
 * ============================================================
 * CHORD DATABASE — API CENTRAL
 *
 * Singleton em memória com geração lazy.
 * ============================================================
 */

let _chords: ChordEntry[] | null = null;
let _indices: ChordIndices | null = null;
let _stats: DatabaseStats | null = null;

/**
 * Inicializa (gera) o banco. Idempotente.
 */
export function initChordDatabase(): void {
  if (_chords) return;

  console.log('🎼 Gerando banco de acordes...');
  const start = Date.now();

  const base = generateBaseChords();
  const slash = generateAllSlashChords();
  const poly = generatePolychords();

  const all = [...base, ...slash, ...poly];
  _chords = enrichChords(all);
  _indices = buildIndices(_chords);
  _stats = calculateStats(_chords);

  const ms = Date.now() - start;
  console.log(`✅ ${_chords.length} acordes gerados em ${ms}ms`);
}

/**
 * Retorna todos os acordes
 */
export function getAllChords(): ChordEntry[] {
  initChordDatabase();
  return _chords!;
}

/**
 * Total de acordes no banco
 */
export function getChordCount(): number {
  initChordDatabase();
  return _chords!.length;
}

/**
 * Busca acorde por ID exato
 */
export function getChordById(id: string): ChordEntry | null {
  initChordDatabase();
  return _indices!.byId.get(id) || null;
}

/**
 * Busca acorde por slug (URL)
 */
export function getChordBySlug(slug: string): ChordEntry | null {
  initChordDatabase();
  return _indices!.bySlug.get(slug) || null;
}

/**
 * Busca acorde por símbolo (Cmaj7, Dm7, etc.)
 */
export function getChordBySymbol(symbol: string): ChordEntry | null {
  initChordDatabase();
  return _indices!.bySymbol.get(symbol) || null;
}

/**
 * Lista acordes por tonalidade (raiz)
 */
export function getChordsByRoot(rootName: string): ChordEntry[] {
  initChordDatabase();
  return _indices!.byRoot.get(rootName) || [];
}

/**
 * Lista acordes por categoria
 */
export function getChordsByCategory(category: string): ChordEntry[] {
  initChordDatabase();
  return _indices!.byCategory.get(category) || [];
}

/**
 * Lista acordes por complexidade
 */
export function getChordsByComplexity(complexity: string): ChordEntry[] {
  initChordDatabase();
  return _indices!.byComplexity.get(complexity) || [];
}

/**
 * Lista acordes por qualidade
 */
export function getChordsByQuality(qualityId: string): ChordEntry[] {
  initChordDatabase();
  return _indices!.byQualityId.get(qualityId) || [];
}

/**
 * Lista acordes por nível de acesso (free, pro, master, premium)
 */
export function getChordsByAccessLevel(level: string): ChordEntry[] {
  initChordDatabase();
  return _indices!.byAccessLevel.get(level) || [];
}

/**
 * Busca textual em acordes
 */
export function searchChords(query: string): ChordEntry[] {
  initChordDatabase();
  return searchInIndices(_indices!, query, _chords!);
}

/**
 * Estatísticas do banco
 */
export function getDatabaseStats(): DatabaseStats {
  initChordDatabase();
  return _stats!;
}

/**
 * Calcula estatísticas
 */
function calculateStats(chords: ChordEntry[]): DatabaseStats {
  return {
    total: chords.length,
    byCategory: countBy(chords, 'category'),
    byComplexity: countBy(chords, 'complexity'),
    byAccessLevel: countBy(chords, 'accessLevel'),
    slashChords: chords.filter((c) => c.isSlashChord).length,
    polychords: chords.filter((c) => c.isPolychord).length,
  };
}

function countBy(
  arr: ChordEntry[],
  key: keyof ChordEntry
): Record<string, number> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * Retorna acordes similares (mesma raiz ou qualidade)
 */
export function getSimilarChords(chordId: string, limit = 6): ChordEntry[] {
  initChordDatabase();
  
  const chord = getChordById(chordId);
  if (!chord) return [];

  const results: ChordEntry[] = [];
  const seen = new Set<string>([chordId]);

  // Mesma qualidade, diferentes raízes
  const sameQuality = getChordsByQuality(chord.qualityId);
  for (const c of sameQuality) {
    if (!seen.has(c.id) && results.length < limit) {
      results.push(c);
      seen.add(c.id);
    }
  }

  // Mesma raiz, diferentes qualidades
  if (results.length < limit) {
    const sameRoot = getChordsByRoot(chord.root.name);
    for (const c of sameRoot) {
      if (!seen.has(c.id) && results.length < limit) {
        results.push(c);
        seen.add(c.id);
      }
    }
  }

  return results;
}

/**
 * Retorna acordes para iniciantes (free + beginner/basic)
 */
export function getBeginnerChords(): ChordEntry[] {
  initChordDatabase();
  
  return _chords!.filter(
    (c) =>
      c.accessLevel === 'free' &&
      (c.complexity === 'beginner' || c.complexity === 'basic') &&
      !c.isSlashChord &&
      !c.isPolychord
  );
}

/**
 * Retorna acordes por estilo musical
 */
export function getChordsByStyle(style: string): ChordEntry[] {
  initChordDatabase();
  
  const normalizedStyle = style.toLowerCase();
  return _chords!.filter((c) =>
    c.styles.some((s) => s.toLowerCase().includes(normalizedStyle))
  );
}

/**
 * Limpa o cache (útil para testes)
 */
export function clearDatabaseCache(): void {
  _chords = null;
  _indices = null;
  _stats = null;
}
