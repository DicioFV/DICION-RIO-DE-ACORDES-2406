/**
 * ============================================================
 * MOTOR TEÓRICO MUSICAL — MUSICVERSE CHORDS
 * API pública do módulo
 * ============================================================
 */

// Types
export type {
  NoteLetter,
  Accidental,
  NoteName,
  PitchClass,
  Octave,
  IntervalQuality,
  IntervalNumber,
  Note,
  Pitch,
  Interval,
  ChordQuality,
  ChordCategory,
  ChordComplexity,
  Chord,
  VoicingType,
  ChordAnalysisResult,
  HarmonicFunction,
  HarmonicFunctionResult,
} from './types';

// Core - Notes
export {
  createNote,
  transposeNote,
  getEnharmonic,
  areEnharmonic,
  getPreferredName,
  semitonesBetween,
  notesEqualByPitch,
  notesEqualByName,
  chromaticScale,
  isNaturalNote,
  getNaturalNotes,
} from './core/notes';

// Core - Pitch
export {
  createPitch,
  midiToPitch,
  noteToMidi,
  midiToFrequency,
  frequencyToMidi,
  pitchToString,
  parsePitch,
  transposePitch,
  pitchDistance,
  pitchesEqual,
  generatePitchRange,
} from './core/pitch';

// Core - Intervals
export {
  createInterval,
  applyInterval,
  intervalBetween,
  invertInterval,
  COMMON_INTERVALS,
  INTERVAL_NAMES_PT,
} from './core/intervals';

// Core - Constants
export {
  LETTER_TO_PITCH,
  LETTERS_ORDER,
  ACCIDENTAL_OFFSET,
  SHARP_NAMES,
  FLAT_NAMES,
  A4_FREQUENCY,
  A4_MIDI,
  SHARP_KEYS,
  FLAT_KEYS,
  NOTE_NAMES_PT,
} from './core/constants';

// Chords - Qualities
export {
  CHORD_QUALITIES,
  QUALITY_BY_ID,
  QUALITY_BY_SYMBOL,
  findQuality,
  findQualityById,
  getQualityCount,
  getQualitiesByCategory,
  getQualitiesByComplexity,
  getAllCategories,
  getAllComplexities,
} from './chords/chord-qualities';

// Chords - Builder
export {
  buildChord,
  buildChordWithQuality,
  buildSlashChord,
  applyEnharmonicContext,
  getChordSymbol,
  getChordDescription,
  getChordFormula,
} from './chords/chord-builder';

// Chords - Parser
export {
  parseChordSymbol,
  tryParseChord,
  isValidChordSymbol,
  extractRoot,
  getCommonChordSymbols,
} from './chords/chord-parser';

// Chords - Inversions
export {
  getInversions,
  applyInversion,
  getMaxInversions,
  getInversionName,
  getBassInterval,
} from './chords/inversions';

// Chords - Voicings
export {
  applyVoicing,
  getVoicingDescription,
  getAllVoicingTypes,
  isVoicingSuitableForChord,
} from './chords/voicings';

// Chords - Analyzer
export {
  analyzeChord,
  bestChordMatch,
  notesMatchChord,
  findMatchingInversion,
  getAlternativeNames,
} from './chords/chord-analyzer';

// Harmony - Functions
export {
  getHarmonicFunction,
  findKeysContainingChord,
  getMajorFieldChords,
  getMinorFieldChords,
  isSecondaryDominant,
  suggestResolution,
} from './harmony/functions';
