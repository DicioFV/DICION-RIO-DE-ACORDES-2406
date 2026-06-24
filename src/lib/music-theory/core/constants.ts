import type { NoteLetter, PitchClass } from '../types';

/**
 * Mapeamento das 7 letras naturais → pitch class
 */
export const LETTER_TO_PITCH: Record<NoteLetter, PitchClass> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/**
 * Ordem cromática das letras (para cálculo de intervalos)
 */
export const LETTERS_ORDER: NoteLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Modificadores de acidentes em semitons
 */
export const ACCIDENTAL_OFFSET: Record<string, number> = {
  '': 0,
  '#': 1,
  'b': -1,
  '##': 2,
  'bb': -2,
};

/**
 * Nomes preferenciais por pitch class (modo "sharps")
 */
export const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Nomes preferenciais por pitch class (modo "flats")
 */
export const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * Frequência da nota A4 (lá central) — referência ISO 16
 */
export const A4_FREQUENCY = 440;
export const A4_MIDI = 69;

/**
 * Tonalidades que preferem sustenidos vs bemóis
 */
export const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
export const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

/**
 * Nomes das notas em português
 */
export const NOTE_NAMES_PT: Record<string, string> = {
  'C': 'Dó',
  'D': 'Ré',
  'E': 'Mi',
  'F': 'Fá',
  'G': 'Sol',
  'A': 'Lá',
  'B': 'Si',
};
