import type { Chord, Note } from '@/lib/music-theory/types';

/**
 * ============================================================
 * TIPOS DO BRAÇO VIRTUAL
 * ============================================================
 */

export type FretboardInstrument =
  | 'guitar-nylon'
  | 'guitar-steel'
  | 'guitar-electric'
  | 'ukulele'
  | 'cavaquinho'
  | 'mandolin';

export type FretboardOrientation = 'right-handed' | 'left-handed';
export type FretboardView = 'diagram' | 'full';
export type FretboardDisplay = 'note-names' | 'degrees' | 'fingering' | 'none';

export interface Tuning {
  id: string;
  name: string;
  notes: string[];
  description?: string;
}

export interface FretPosition {
  string: number;
  fret: number;
  finger?: number;
  isRoot?: boolean;
  isBass?: boolean;
  note?: Note;
  degree?: string;
}

export interface ChordShape {
  id: string;
  chord: Chord;
  positions: FretPosition[];
  barres: BarreInfo[];
  baseFret: number;
  shapeName?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  description?: string;
}

export interface BarreInfo {
  fret: number;
  fromString: number;
  toString: number;
  finger: number;
}

export interface FretboardConfig {
  instrument: FretboardInstrument;
  tuning: Tuning;
  orientation: FretboardOrientation;
  view: FretboardView;
  display: FretboardDisplay;
  showAllNotes: boolean;
  fretCount: number;
}
