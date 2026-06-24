// FUTURO: Tipos de instrumentos (Bloco 05-06)

export interface PianoConfig {
  startOctave: number;
  endOctave: number;
  highlightedNotes: string[];
  rootNote: string | null;
}

export interface FretboardConfig {
  strings: number;
  frets: number;
  tuning: string[];
  capo: number;
  highlightedPositions: FretPosition[];
}

export interface FretPosition {
  string: number;
  fret: number;
  note: string;
  isRoot: boolean;
  finger?: number;
}
