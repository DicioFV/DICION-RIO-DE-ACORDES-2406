/**
 * ============================================================
 * FRETBOARD MODULE — Public API
 * ============================================================
 */

export type {
  FretboardInstrument,
  FretboardOrientation,
  FretboardView,
  FretboardDisplay,
  Tuning,
  FretPosition,
  ChordShape,
  BarreInfo,
  FretboardConfig,
} from './fretboard-types';

export {
  getNoteAtFret,
  findNoteOnString,
  generateFretboardNoteMap,
  getDegreeLabelFromInterval,
} from './fretboard-engine';

export {
  GUITAR_TUNINGS,
  UKULELE_TUNINGS,
  CAVAQUINHO_TUNINGS,
  MANDOLIN_TUNINGS,
  getTuningsForInstrument,
  getStringCount,
} from './tunings';

export { findChordShapes } from './chord-shape-finder';
export { assignFingers } from './fingering-engine';

export {
  FRETBOARD_DIMENSIONS,
  FRET_MARKERS,
  DOUBLE_FRET_MARKERS,
  getFretWidth,
} from './fretboard-layout';

export {
  INSTRUMENT_SPECS,
  getInstrumentSpec,
  getAllInstruments,
  getInstrumentsByCategory,
  type InstrumentSpec,
} from './instrument-specs';

export {
  calculateMandolinStringPositions,
  getMandolinTotalStringWidth,
  type PairedStringLayout,
} from './mandolin-renderer';
