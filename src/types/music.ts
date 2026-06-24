// FUTURO: Tipos musicais completos (Bloco 02)

export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '#' | 'b' | '';
export type NoteWithAccidental = `${NoteName}${Accidental}`;

export type IntervalQuality = 'P' | 'M' | 'm' | 'A' | 'd';
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Note {
  name: NoteName;
  accidental: Accidental;
  octave: number;
  midi: number;
  frequency: number;
}

export interface Interval {
  quality: IntervalQuality;
  number: IntervalNumber;
  semitones: number;
  name: string;
}

export interface Chord {
  root: NoteWithAccidental;
  quality: string;
  symbol: string;
  name: string;
  notes: NoteWithAccidental[];
  intervals: Interval[];
  formula: string;
}

export interface ChordVoicing {
  chord: Chord;
  instrumentId: string;
  positions: number[];
  inversion: number;
  label: string;
}
