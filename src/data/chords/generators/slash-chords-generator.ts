import { buildChord, createNote, buildSlashChord } from '@/lib/music-theory';
import { PRIMARY_ROOTS } from '@/data/keys/all-keys';
import {
  generateChordId,
  generateChordSlug,
  generateDisplayName,
} from '@/data/slugs/chord-slug-generator';
import type { ChordEntry } from '../chord-schema';

/**
 * ============================================================
 * GERADOR DE SLASH CHORDS
 *
 * Para cada tríade e tétrade básica, cria inversões com
 * baixos comuns (3ª, 5ª, 7ª e também baixos diatônicos)
 * ============================================================
 */

// Qualidades mais usadas em slash chords
const SLASH_QUALITIES = ['maj', 'min', 'maj7', 'm7', '7'];

export function generateSlashChords(): ChordEntry[] {
  const chords: ChordEntry[] = [];
  const now = new Date().toISOString();
  const seenIds = new Set<string>();

  for (const key of PRIMARY_ROOTS) {
    for (const qualityId of SLASH_QUALITIES) {
      try {
        const root = createNote(key.name);
        const baseChord = buildChord(root, qualityId);

        // Para cada nota do acorde (exceto raiz), cria slash chord
        for (let i = 1; i < baseChord.notes.length; i++) {
          const bassNote = baseChord.notes[i];
          const slashed = buildSlashChord(baseChord, bassNote);

          const id = generateChordId(key.name, qualityId, bassNote.name);
          
          // Evita duplicatas
          if (seenIds.has(id)) continue;
          seenIds.add(id);

          const slug = generateChordSlug(key.name, qualityId, bassNote.name);
          const displayName = generateDisplayName(
            key.name,
            baseChord.quality.fullName,
            bassNote.name
          );

          chords.push({
            id,
            slug,
            symbol: slashed.symbol,
            symbolAlternatives: [],
            root: baseChord.root,
            bass: bassNote,
            notes: baseChord.notes,
            intervals: baseChord.intervals,
            qualityId,
            qualityName: baseChord.quality.fullName,
            category: 'slash',
            complexity: 'intermediate',
            displayName,
            shortDescription: `Inversão de ${baseChord.symbol} com ${bassNote.name} no baixo.`,
            commonKeys: [],
            functions: [],
            enharmonicEquivalents: [],
            styles: ['pop', 'gospel', 'mpb', 'piano-solo'],
            isSlashChord: true,
            isPolychord: false,
            accessLevel: 'pro',
            createdAt: now,
            updatedAt: now,
          });
        }
      } catch {
        // Ignore errors
      }
    }
  }

  return chords;
}

/**
 * Gera slash chords com baixos "exóticos" (não pertencentes ao acorde)
 * Ex: C/Bb, G/F, etc.
 */
export function generateExoticSlashChords(): ChordEntry[] {
  const chords: ChordEntry[] = [];
  const now = new Date().toISOString();
  const seenIds = new Set<string>();

  // Padrões comuns de slash chords exóticos
  const exoticPatterns = [
    { quality: 'maj', basses: ['Bb', 'D', 'F'] },
    { quality: 'min', basses: ['Bb', 'F'] },
    { quality: 'maj7', basses: ['D', 'F'] },
  ];

  for (const key of PRIMARY_ROOTS.slice(0, 6)) { // Limita para não explodir
    for (const pattern of exoticPatterns) {
      try {
        const root = createNote(key.name);
        const baseChord = buildChord(root, pattern.quality);

        for (const bassName of pattern.basses) {
          // Pula se o baixo já faz parte do acorde
          if (baseChord.notes.some((n) => n.name === bassName)) continue;

          try {
            const bassNote = createNote(bassName);
            const slashed = buildSlashChord(baseChord, bassNote);

            const id = generateChordId(key.name, pattern.quality, bassName);
            
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            const slug = generateChordSlug(key.name, pattern.quality, bassName);

            chords.push({
              id,
              slug,
              symbol: slashed.symbol,
              symbolAlternatives: [],
              root: baseChord.root,
              bass: bassNote,
              notes: baseChord.notes,
              intervals: baseChord.intervals,
              qualityId: pattern.quality,
              qualityName: baseChord.quality.fullName,
              category: 'slash',
              complexity: 'advanced',
              displayName: generateDisplayName(
                key.name,
                baseChord.quality.fullName,
                bassName
              ),
              shortDescription: `${baseChord.symbol} com ${bassName} no baixo — slash chord cromático.`,
              commonKeys: [],
              functions: [],
              enharmonicEquivalents: [],
              styles: ['gospel', 'jazz', 'mpb', 'piano-solo'],
              isSlashChord: true,
              isPolychord: false,
              accessLevel: 'master',
              createdAt: now,
              updatedAt: now,
            });
          } catch {
            // Ignore invalid bass notes
          }
        }
      } catch {
        // Ignore errors
      }
    }
  }

  return chords;
}

/**
 * Gera todos os slash chords
 */
export function generateAllSlashChords(): ChordEntry[] {
  return [...generateSlashChords(), ...generateExoticSlashChords()];
}
