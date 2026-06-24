import type { Note, NoteLetter, NoteName, PitchClass, Accidental } from '../types';
import {
  LETTER_TO_PITCH,
  ACCIDENTAL_OFFSET,
  SHARP_NAMES,
  FLAT_NAMES,
  SHARP_KEYS,
  FLAT_KEYS,
} from './constants';

/**
 * ============================================================
 * SISTEMA DE NOTAS — Criação, parsing, enarmonia
 * ============================================================
 */

/**
 * Cria uma nota a partir do nome (ex: "C#", "Db", "F##")
 */
export function createNote(name: NoteName): Note {
  const match = name.match(/^([A-G])(##|bb|#|b)?$/);
  if (!match) {
    throw new Error(`Nome de nota inválido: "${name}"`);
  }

  const letter = match[1] as NoteLetter;
  const accidental = (match[2] || '') as Accidental;
  const basePitch = LETTER_TO_PITCH[letter];
  const offset = ACCIDENTAL_OFFSET[accidental];
  const pitchClass = ((basePitch + offset) % 12 + 12) % 12;

  return {
    name,
    letter,
    accidental,
    pitchClass,
  };
}

/**
 * Verifica se duas notas são enarmônicas (mesmo som, nomes diferentes)
 * Ex: C# e Db
 */
export function areEnharmonic(a: Note, b: Note): boolean {
  return a.pitchClass === b.pitchClass && a.name !== b.name;
}

/**
 * Retorna a nota enarmônica equivalente
 * Ex: C# → Db, F# → Gb
 */
export function getEnharmonic(note: Note): Note | null {
  const enharmonicMap: Record<string, string> = {
    'C#': 'Db',
    'Db': 'C#',
    'D#': 'Eb',
    'Eb': 'D#',
    'F#': 'Gb',
    'Gb': 'F#',
    'G#': 'Ab',
    'Ab': 'G#',
    'A#': 'Bb',
    'Bb': 'A#',
    'E': 'Fb',
    'Fb': 'E',
    'B': 'Cb',
    'Cb': 'B',
    'F': 'E#',
    'E#': 'F',
    'C': 'B#',
    'B#': 'C',
  };

  const otherName = enharmonicMap[note.name];
  return otherName ? createNote(otherName) : null;
}

/**
 * Retorna o nome preferencial de uma nota baseado no contexto tonal.
 * Ex: em F (que usa bemóis), preferimos Bb a A#.
 */
export function getPreferredName(pitchClass: PitchClass, contextKey?: string): NoteName {
  if (!contextKey) return SHARP_NAMES[pitchClass];

  const cleanKey = contextKey.replace(/m$/, ''); // remove "m" de menores
  if (FLAT_KEYS.includes(cleanKey)) return FLAT_NAMES[pitchClass];
  if (SHARP_KEYS.includes(cleanKey)) return SHARP_NAMES[pitchClass];

  return SHARP_NAMES[pitchClass];
}

/**
 * Transpõe uma nota por N semitons.
 * Use `preferFlats` quando o contexto pedir bemóis.
 */
export function transposeNote(
  note: Note,
  semitones: number,
  preferFlats = false
): Note {
  const newPitchClass = ((note.pitchClass + semitones) % 12 + 12) % 12;
  const names = preferFlats ? FLAT_NAMES : SHARP_NAMES;
  return createNote(names[newPitchClass]);
}

/**
 * Distância em semitons entre duas notas (ascendente, 0-11)
 */
export function semitonesBetween(from: Note, to: Note): number {
  return ((to.pitchClass - from.pitchClass) % 12 + 12) % 12;
}

/**
 * Compara duas notas pela pitch class (ignora enarmonia)
 */
export function notesEqualByPitch(a: Note, b: Note): boolean {
  return a.pitchClass === b.pitchClass;
}

/**
 * Compara duas notas pelo nome exato
 */
export function notesEqualByName(a: Note, b: Note): boolean {
  return a.name === b.name;
}

/**
 * Lista todas as 12 notas cromáticas a partir de uma nota dada
 */
export function chromaticScale(from: Note = createNote('C'), preferFlats = false): Note[] {
  return Array.from({ length: 12 }, (_, i) => transposeNote(from, i, preferFlats));
}

/**
 * Verifica se uma nota é natural (sem acidente)
 */
export function isNaturalNote(note: Note): boolean {
  return note.accidental === '';
}

/**
 * Retorna todas as notas naturais
 */
export function getNaturalNotes(): Note[] {
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(createNote);
}
