import { buildChord, createNote } from '@/lib/music-theory';
import { PRIMARY_ROOTS } from '@/data/keys/all-keys';
import type { ChordEntry } from '../chord-schema';
import type { Note } from '@/lib/music-theory/types';

/**
 * ============================================================
 * GERADOR DE POLIACORDES (Upper Structure Triads)
 *
 * Combinações clássicas de estruturas superiores sobre dominantes
 * ============================================================
 */

interface PolychordPattern {
  upperInterval: number; // Semitons acima da raiz
  upperQuality: string;
  description: string;
  scale: string;
}

// Padrões comuns de poliacordes sobre dominante (7)
const POLYCHORD_PATTERNS: PolychordPattern[] = [
  { upperInterval: 2, upperQuality: 'maj', description: 'Lídio (#11)', scale: 'Lídio Dominante' },
  { upperInterval: 2, upperQuality: 'min', description: 'Frígio Dominante', scale: 'Frígio' },
  { upperInterval: 3, upperQuality: 'maj', description: 'Dominante alterado (#9)', scale: 'Alterada' },
  { upperInterval: 6, upperQuality: 'maj', description: 'Alterado completo', scale: 'Alterada' },
  { upperInterval: 8, upperQuality: 'maj', description: 'Frígio (b9, b13)', scale: 'Frígio' },
  { upperInterval: 10, upperQuality: 'maj', description: 'Dominante 9', scale: 'Mixolídio' },
];

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNoteName(pitchClass: number): string {
  return SHARP_NAMES[((pitchClass % 12) + 12) % 12];
}

export function generatePolychords(): ChordEntry[] {
  const chords: ChordEntry[] = [];
  const now = new Date().toISOString();
  const seenIds = new Set<string>();

  // Gera poliacordes apenas para as 12 tonalidades principais
  for (const key of PRIMARY_ROOTS) {
    for (const pattern of POLYCHORD_PATTERNS) {
      try {
        const rootNote = createNote(key.name);
        const rootPitchClass = rootNote.pitchClass;

        // Calcula a raiz do acorde superior
        const upperPitchClass = (rootPitchClass + pattern.upperInterval) % 12;
        const upperRootName = getNoteName(upperPitchClass);

        // Constrói os acordes
        const lowerChord = buildChord(rootNote, '7');
        const upperChord = buildChord(createNote(upperRootName), pattern.upperQuality);

        // Combina todas as notas (removendo duplicatas por pitch class)
        const allNotes: Note[] = [...lowerChord.notes];
        for (const note of upperChord.notes) {
          if (!allNotes.some((n) => n.pitchClass === note.pitchClass)) {
            allNotes.push(note);
          }
        }

        // Símbolo do poliacorde
        const symbol = `${upperChord.symbol}/${lowerChord.symbol}`;

        // ID único
        const upperSanitized = upperRootName.toLowerCase().replace('#', 'sharp');
        const lowerSanitized = key.name.toLowerCase().replace('#', 'sharp');
        const id = `poly-${upperSanitized}-${pattern.upperQuality}-over-${lowerSanitized}-7`;

        if (seenIds.has(id)) continue;
        seenIds.add(id);

        // Slug
        const slug = `poliacorde-${key.slug}-${pattern.description.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        chords.push({
          id,
          slug,
          symbol,
          symbolAlternatives: [],
          root: rootNote,
          notes: allNotes,
          intervals: [], // Poliacordes não têm intervalos simples
          qualityId: 'polychord',
          qualityName: 'Poliacorde',
          category: 'polychord',
          complexity: 'master',
          displayName: `Poliacorde ${upperChord.symbol} sobre ${lowerChord.symbol}`,
          shortDescription: `Estrutura superior: ${pattern.description}. Escala: ${pattern.scale}.`,
          commonKeys: [],
          functions: ['V7 alterado'],
          enharmonicEquivalents: [],
          styles: ['jazz', 'fusion', 'modern', 'contemporary'],
          isSlashChord: false,
          isPolychord: true,
          accessLevel: 'premium',
          createdAt: now,
          updatedAt: now,
        });
      } catch {
        // Ignore errors
      }
    }
  }

  return chords;
}
