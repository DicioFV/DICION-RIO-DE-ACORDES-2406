/**
 * ============================================================
 * TIPOS CENTRAIS DO MOTOR TEÓRICO MUSICAL
 * ============================================================
 */

// Letras das notas (sem alteração)
export type NoteLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Acidentes (alterações)
export type Accidental = '' | '#' | 'b' | '##' | 'bb';

// Nome de nota completo (ex: "C", "C#", "Db", "F##")
export type NoteName = string;

// Pitch class: 0 a 11 (C=0, C#=1, ..., B=11)
export type PitchClass = number;

// Oitava (notação científica: C4 = dó central)
export type Octave = number;

// Tipos de intervalo
export type IntervalQuality =
  | 'P' // Perfeito (Perfect)
  | 'M' // Maior (Major)
  | 'm' // Menor (minor)
  | 'A' // Aumentado (Augmented)
  | 'd'; // Diminuto (diminished)

// Número do intervalo (1 a 13)
export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

// Representação de uma nota (sem oitava)
export interface Note {
  name: NoteName; // "C#", "Db", etc.
  letter: NoteLetter; // "C", "D", etc.
  accidental: Accidental; // "", "#", "b", ...
  pitchClass: PitchClass; // 0-11
}

// Pitch absoluto (com oitava)
export interface Pitch {
  note: Note;
  octave: Octave;
  midi: number; // Número MIDI (C-1 = 0, A4 = 69)
  frequency: number; // Frequência em Hz
}

// Intervalo
export interface Interval {
  name: string; // "M3", "P5", "m7", etc.
  quality: IntervalQuality;
  number: IntervalNumber;
  semitones: number; // Distância em semitons
  shortName: string; // "3M", "5J" (notação brasileira opcional)
}

// Qualidade de acorde
export interface ChordQuality {
  id: string; // "maj", "min", "7", "maj7", etc.
  symbol: string; // "", "m", "7", "maj7", etc.
  fullName: string; // "Maior", "Menor", "Sétima Dominante"
  aliases: string[]; // ["M", "Major", "Δ"]
  intervals: string[]; // ["P1", "M3", "P5"]
  category: ChordCategory;
  complexity: ChordComplexity;
}

export type ChordCategory =
  | 'triad'
  | 'seventh'
  | 'extended'
  | 'altered'
  | 'suspended'
  | 'added'
  | 'sixth'
  | 'diminished'
  | 'augmented'
  | 'power'
  | 'slash'
  | 'polychord';

export type ChordComplexity = 'beginner' | 'basic' | 'intermediate' | 'advanced' | 'master';

// Acorde construído
export interface Chord {
  symbol: string; // "Cmaj7", "Dm9", "G7#5"
  root: Note; // Nota fundamental
  bass?: Note; // Nota do baixo (para slash chords)
  quality: ChordQuality;
  notes: Note[]; // Notas em estado fundamental
  intervals: Interval[]; // Intervalos a partir da raiz
  pitches?: Pitch[]; // Pitches absolutos (quando voicing aplicado)
  inversion?: number; // 0 = fundamental, 1 = 1ª, ...
  voicing?: VoicingType;
}

export type VoicingType =
  | 'close'
  | 'open'
  | 'drop2'
  | 'drop3'
  | 'drop2and4'
  | 'spread'
  | 'rootless-a'
  | 'rootless-b';

// Resultado de análise reversa
export interface ChordAnalysisResult {
  chord: Chord;
  confidence: number; // 0 a 1
  inversion: number;
  alternativeNames: string[];
}

// Função harmônica
export type HarmonicFunction =
  | 'tonic' // T — Tônica
  | 'subdominant' // SD — Subdominante
  | 'dominant' // D — Dominante
  | 'tonic-relative' // Tr — Tônica relativa
  | 'subdominant-rel' // SDr
  | 'dominant-rel' // Dr
  | 'secondary-dom' // V/x — Dominante secundário
  | 'unknown';

export interface HarmonicFunctionResult {
  function: HarmonicFunction;
  degree: string; // "I", "ii", "V7", etc.
  description: string;
}
