/**
 * ============================================================
 * AUDIO MODULE — Public API
 * ============================================================
 */

export type {
  AudioInstrumentId,
  PlaybackMode,
  AudioPreset,
  PlaybackConfig,
} from './audio-types';

export {
  AUDIO_PRESETS,
  getPreset,
  getPresetsByCategory,
  getAllPresets,
  getPresetCategories,
  getCategoryLabel,
  VISUAL_TO_AUDIO_MAP,
} from './audio-presets';

export {
  initAudioEngine,
  ensureInitialized,
  isAudioInitialized,
  loadSampler,
  isSamplerLoaded,
  getSampler,
  setMasterVolume,
  setMasterMute,
  getMasterVolume,
  isMasterMuted,
  midiToToneNote,
  stopAll,
  clearAudioCache,
} from './audio-engine';

export {
  playChord,
  playNote,
  PLAYBACK_MODE_LABELS,
  getPlayableModes,
} from './playback-modes';
