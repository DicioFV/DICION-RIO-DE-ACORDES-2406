import type { Pitch, Chord } from '@/lib/music-theory/types';

/**
 * ============================================================
 * TIPOS DO PIANO VIRTUAL
 * ============================================================
 */

export type PianoHand = 'right' | 'left' | 'both';

export type PianoDisplayMode = 'note-names' | 'degrees' | 'fingering' | 'none';

export type PianoRange = 'full-88' | 'compact-49' | 'compact-25' | 'chord-focus';

export interface PianoKeyData {
  midi: number; // Número MIDI (21 a 108)
  pitch: Pitch; // Pitch absoluto
  isBlack: boolean; // Tecla preta ou branca
  isActive: boolean; // Está sendo tocada?
  isRoot: boolean; // É a tônica do acorde?
  isBass: boolean; // É a nota do baixo?
  degree?: string; // "1", "3", "5", "b7"
  finger?: number; // 1 a 5
  label?: string; // Texto a exibir
  hand?: PianoHand; // Mão sugerida (D ou E)
}

export interface PianoConfig {
  range: PianoRange;
  startMidi: number; // Primeira tecla visível
  endMidi: number; // Última tecla visível
  hand: PianoHand;
  displayMode: PianoDisplayMode;
  showOctaveNumbers: boolean;
  zoomLevel: number; // 0.5 a 2.0
}

export interface PianoState {
  chord: Chord | null;
  inversion: number;
  voicing: string;
  config: PianoConfig;
  activeKeys: number[]; // MIDI numbers
}
