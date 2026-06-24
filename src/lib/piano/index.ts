/**
 * ============================================================
 * PIANO MODULE — Public API
 * ============================================================
 */

// Types
export type {
  PianoHand,
  PianoDisplayMode,
  PianoRange,
  PianoKeyData,
  PianoConfig,
  PianoState,
} from './piano-types';

// Layout
export {
  isBlackKey,
  PIANO_DIMENSIONS,
  countWhiteKeys,
  getKeyX,
  getTotalWidth,
  PIANO_RANGES,
  getChordFocusRange,
  midiToNoteName,
  midiToOctave,
} from './piano-layout';

// Fingering
export {
  suggestFingering,
  suggestHand,
  FINGER_NAMES,
  type FingerSuggestion,
} from './piano-fingering';

// Engine
export {
  computeActiveMidis,
  generateKeysData,
} from './piano-engine';
