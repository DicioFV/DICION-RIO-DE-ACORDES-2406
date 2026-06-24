import {
  buildChord,
  createNote,
  CHORD_QUALITIES,
  getHarmonicFunction,
} from '@/lib/music-theory';
import { CHORD_ROOTS, DIATONIC_KEYS } from '@/data/keys/all-keys';
import {
  generateChordId,
  generateChordSlug,
  generateDisplayName,
  generateSymbolAlternatives,
} from '@/data/slugs/chord-slug-generator';
import {
  QUALITY_SHORT_DESCRIPTIONS,
  STYLES_BY_CATEGORY,
  getUsageExamples,
} from '@/data/content/chord-descriptions';
import type { ChordEntry } from '../chord-schema';
import { determineAccessLevel } from '../chord-schema';
import type { Chord } from '@/lib/music-theory/types';

/**
 * ============================================================
 * GERADOR DE ACORDES BASE
 * 17 tonalidades (cromáticas) × 42 qualidades = ~714 acordes
 * ============================================================
 */

export function generateBaseChords(): ChordEntry[] {
  const chords: ChordEntry[] = [];
  const now = new Date().toISOString();
  const seenIds = new Set<string>();

  for (const key of CHORD_ROOTS) {
    for (const quality of CHORD_QUALITIES) {
      try {
        const root = createNote(key.name);
        const chord = buildChord(root, quality.id);

        const id = generateChordId(key.name, quality.id);
        
        // Evita duplicatas
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const slug = generateChordSlug(key.name, quality.id);
        const displayName = generateDisplayName(key.name, quality.fullName);
        const symbolAlternatives = generateSymbolAlternatives(key.name, quality.aliases);

        // Calcula tonalidades onde o acorde aparece de forma diatônica
        const commonKeys = findCommonKeys(chord);

        // Funções harmônicas
        const functions = commonKeys.slice(0, 3).map((k) => {
          try {
            const fn = getHarmonicFunction(chord, createNote(k));
            return `${fn.degree} de ${k}`;
          } catch {
            return '';
          }
        }).filter(Boolean);

        const entry: ChordEntry = {
          id,
          slug,
          symbol: chord.symbol,
          symbolAlternatives,
          root: chord.root,
          notes: chord.notes,
          intervals: chord.intervals,
          qualityId: quality.id,
          qualityName: quality.fullName,
          category: quality.category,
          complexity: quality.complexity,
          displayName,
          shortDescription: QUALITY_SHORT_DESCRIPTIONS[quality.id] || '',
          commonKeys,
          functions,
          enharmonicEquivalents: [],
          styles: STYLES_BY_CATEGORY[quality.category] || [],
          usageExamples: getUsageExamples(quality.id),
          isSlashChord: false,
          isPolychord: false,
          accessLevel: determineAccessLevel(quality.complexity),
          createdAt: now,
          updatedAt: now,
        };

        chords.push(entry);
      } catch (err) {
        // Silently skip invalid combinations
        console.warn(`Erro ao gerar ${key.name}${quality.symbol}:`, err);
      }
    }
  }

  // Marca enarmônicos cruzados (C# e Db, F# e Gb, etc.)
  markEnharmonicEquivalents(chords);

  return chords;
}

/**
 * Identifica tonalidades onde o acorde aparece como grau diatônico
 */
function findCommonKeys(chord: Chord): string[] {
  const keys: string[] = [];

  for (const key of DIATONIC_KEYS) {
    try {
      const fn = getHarmonicFunction(chord, createNote(key.name));
      if (fn.function !== 'unknown') {
        keys.push(key.name);
      }
    } catch {
      // Ignore errors
    }
  }

  return keys;
}

/**
 * Marca enarmônicos entre acordes (C#maj7 ↔ Dbmaj7)
 */
function markEnharmonicEquivalents(chords: ChordEntry[]): void {
  const byNotes = new Map<string, ChordEntry[]>();

  for (const c of chords) {
    // Cria uma chave baseada nos pitch classes das notas + qualidade
    const key =
      c.notes
        .map((n) => n.pitchClass)
        .sort((a, b) => a - b)
        .join('-') +
      '|' +
      c.qualityId;

    if (!byNotes.has(key)) byNotes.set(key, []);
    byNotes.get(key)!.push(c);
  }

  for (const group of byNotes.values()) {
    if (group.length > 1) {
      for (const c of group) {
        c.enharmonicEquivalents = group
          .filter((x) => x.id !== c.id)
          .map((x) => x.id);
      }
    }
  }
}
