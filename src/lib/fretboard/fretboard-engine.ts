import { createNote, transposeNote, semitonesBetween } from '@/lib/music-theory';
import type { Note } from '@/lib/music-theory/types';
import type { Tuning } from './fretboard-types';

/**
 * ============================================================
 * MOTOR DO BRAÇO
 * ============================================================
 */

/**
 * Calcula a nota produzida ao tocar uma corda numa determinada casa
 */
export function getNoteAtFret(stringTuning: string, fret: number): Note {
  if (fret < 0) throw new Error('Fret negativo');
  const open = createNote(stringTuning);
  return transposeNote(open, fret);
}

/**
 * Encontra todas as casas onde uma nota aparece em uma corda (0 a maxFret)
 */
export function findNoteOnString(
  stringTuning: string,
  targetNote: Note,
  maxFret = 24
): number[] {
  const open = createNote(stringTuning);
  const distance = semitonesBetween(open, targetNote);
  const positions: number[] = [];

  for (let fret = distance; fret <= maxFret; fret += 12) {
    positions.push(fret);
  }

  return positions;
}

/**
 * Gera mapa completo de notas no braço
 */
export function generateFretboardNoteMap(
  tuning: Tuning,
  fretCount = 24
): Note[][] {
  const map: Note[][] = [];
  for (let s = 0; s < tuning.notes.length; s++) {
    const stringMap: Note[] = [];
    for (let f = 0; f <= fretCount; f++) {
      stringMap.push(getNoteAtFret(tuning.notes[s], f));
    }
    map.push(stringMap);
  }
  return map;
}

/**
 * Get the degree label for an interval
 */
export function getDegreeLabelFromInterval(interval: number): string {
  const degreeMap: Record<number, string> = {
    0: '1', 1: 'b9', 2: '9', 3: 'b3', 4: '3',
    5: '11', 6: 'b5', 7: '5', 8: '#5', 9: '13',
    10: 'b7', 11: '7',
  };
  return degreeMap[((interval % 12) + 12) % 12] || '?';
}
