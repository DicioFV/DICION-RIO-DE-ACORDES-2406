import type { AudioPreset, AudioInstrumentId } from './audio-types';

/**
 * ============================================================
 * BIBLIOTECA DE PRESETS DE INSTRUMENTOS
 *
 * Usa samples do repositório Tone.js (CC license)
 * ============================================================
 */

const SAMPLES_BASE = 'https://tonejs.github.io/audio';

const PIANO_SAMPLES = [
  'A0', 'C1', 'D#1', 'F#1', 'A1', 'C2', 'D#2', 'F#2',
  'A2', 'C3', 'D#3', 'F#3', 'A3', 'C4', 'D#4', 'F#4',
  'A4', 'C5', 'D#5', 'F#5', 'A5', 'C6', 'D#6', 'F#6',
  'A6', 'C7', 'D#7', 'F#7', 'A7', 'C8',
];

const CASIO_SAMPLES = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
];

const COMPACT_SAMPLES = ['C2', 'C3', 'C4', 'C5', 'C6'];

export const AUDIO_PRESETS: Record<AudioInstrumentId, AudioPreset> = {
  'piano-acoustic': {
    id: 'piano-acoustic',
    name: 'Piano Acústico',
    category: 'piano',
    sampleBaseUrl: `${SAMPLES_BASE}/salamander/`,
    sampleFormat: 'mp3',
    sampleNotes: PIANO_SAMPLES,
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 1.2 },
    defaultVolume: -6,
    defaultReverb: 0.25,
  },
  'piano-bright': {
    id: 'piano-bright',
    name: 'Piano Brilhante',
    category: 'piano',
    sampleBaseUrl: `${SAMPLES_BASE}/salamander/`,
    sampleFormat: 'mp3',
    sampleNotes: PIANO_SAMPLES,
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.9 },
    defaultVolume: -5,
    defaultReverb: 0.15,
  },
  'piano-warm': {
    id: 'piano-warm',
    name: 'Piano Quente',
    category: 'piano',
    sampleBaseUrl: `${SAMPLES_BASE}/salamander/`,
    sampleFormat: 'mp3',
    sampleNotes: PIANO_SAMPLES,
    envelope: { attack: 0.015, decay: 0.4, sustain: 0.6, release: 1.8 },
    defaultVolume: -7,
    defaultReverb: 0.4,
  },
  'epiano': {
    id: 'epiano',
    name: 'Piano Elétrico',
    category: 'keyboard',
    sampleBaseUrl: `${SAMPLES_BASE}/casio/`,
    sampleFormat: 'mp3',
    sampleNotes: CASIO_SAMPLES,
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.7, release: 1.5 },
    defaultVolume: -6,
    defaultReverb: 0.25,
  },
  'guitar-nylon': {
    id: 'guitar-nylon',
    name: 'Violão Nylon',
    category: 'guitar',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-acoustic/`,
    sampleFormat: 'mp3',
    sampleNotes: ['A2', 'A3', 'A4', 'C3', 'C4', 'C5', 'E2', 'E3', 'E4', 'G3', 'G4'],
    envelope: { attack: 0.005, decay: 0.4, sustain: 0.3, release: 1.2 },
    defaultVolume: -4,
    defaultReverb: 0.2,
  },
  'guitar-steel': {
    id: 'guitar-steel',
    name: 'Violão Aço',
    category: 'guitar',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-acoustic/`,
    sampleFormat: 'mp3',
    sampleNotes: ['A2', 'A3', 'A4', 'C3', 'C4', 'C5', 'E2', 'E3', 'E4', 'G3', 'G4'],
    envelope: { attack: 0.003, decay: 0.3, sustain: 0.4, release: 1.4 },
    defaultVolume: -4,
    defaultReverb: 0.25,
  },
  'guitar-electric': {
    id: 'guitar-electric',
    name: 'Guitarra Clean',
    category: 'guitar',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-electric/`,
    sampleFormat: 'mp3',
    sampleNotes: ['A2', 'A3', 'A4', 'C3', 'C4', 'C5'],
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 1.8 },
    defaultVolume: -5,
    defaultReverb: 0.3,
  },
  'ukulele': {
    id: 'ukulele',
    name: 'Ukulele',
    category: 'small-strings',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-acoustic/`,
    sampleFormat: 'mp3',
    sampleNotes: ['C4', 'E4', 'G4', 'A4', 'C5'],
    envelope: { attack: 0.003, decay: 0.25, sustain: 0.2, release: 0.9 },
    defaultVolume: -3,
    defaultReverb: 0.15,
  },
  'cavaquinho': {
    id: 'cavaquinho',
    name: 'Cavaquinho',
    category: 'small-strings',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-acoustic/`,
    sampleFormat: 'mp3',
    sampleNotes: ['C4', 'E4', 'G4', 'A4', 'C5'],
    envelope: { attack: 0.002, decay: 0.2, sustain: 0.15, release: 0.7 },
    defaultVolume: -3,
    defaultReverb: 0.18,
  },
  'mandolin': {
    id: 'mandolin',
    name: 'Bandolim',
    category: 'small-strings',
    sampleBaseUrl: `${SAMPLES_BASE}/guitar-acoustic/`,
    sampleFormat: 'mp3',
    sampleNotes: ['G3', 'A3', 'C4', 'E4', 'A4'],
    envelope: { attack: 0.002, decay: 0.18, sustain: 0.1, release: 0.6 },
    defaultVolume: -3,
    defaultReverb: 0.22,
  },
  'organ': {
    id: 'organ',
    name: 'Órgão',
    category: 'keyboard',
    sampleBaseUrl: `${SAMPLES_BASE}/casio/`,
    sampleFormat: 'mp3',
    sampleNotes: CASIO_SAMPLES,
    envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.4 },
    defaultVolume: -8,
    defaultReverb: 0.4,
  },
  'strings': {
    id: 'strings',
    name: 'Cordas Sinfônicas',
    category: 'orchestral',
    sampleBaseUrl: `${SAMPLES_BASE}/casio/`,
    sampleFormat: 'mp3',
    sampleNotes: CASIO_SAMPLES,
    envelope: { attack: 0.5, decay: 0.2, sustain: 0.9, release: 2.5 },
    defaultVolume: -10,
    defaultReverb: 0.55,
  },
  'pad': {
    id: 'pad',
    name: 'Pad Quente',
    category: 'orchestral',
    sampleBaseUrl: `${SAMPLES_BASE}/casio/`,
    sampleFormat: 'mp3',
    sampleNotes: COMPACT_SAMPLES,
    envelope: { attack: 1.5, decay: 0.5, sustain: 0.8, release: 3 },
    defaultVolume: -12,
    defaultReverb: 0.7,
  },
};

export function getPreset(id: AudioInstrumentId): AudioPreset {
  return AUDIO_PRESETS[id];
}

export function getPresetsByCategory(category: AudioPreset['category']): AudioPreset[] {
  return Object.values(AUDIO_PRESETS).filter((p) => p.category === category);
}

export function getAllPresets(): AudioPreset[] {
  return Object.values(AUDIO_PRESETS);
}

export function getPresetCategories(): AudioPreset['category'][] {
  return ['piano', 'keyboard', 'guitar', 'small-strings', 'orchestral'];
}

export function getCategoryLabel(category: AudioPreset['category']): string {
  const map: Record<string, string> = {
    'piano': 'Piano',
    'keyboard': 'Teclados',
    'guitar': 'Violão & Guitarra',
    'small-strings': 'Cordas Pequenas',
    'orchestral': 'Orquestral',
  };
  return map[category] || category;
}

/** Visual instrument → default audio instrument */
export const VISUAL_TO_AUDIO_MAP: Record<string, AudioInstrumentId> = {
  'piano': 'piano-acoustic',
  'guitar-nylon': 'guitar-nylon',
  'guitar-steel': 'guitar-steel',
  'guitar-electric': 'guitar-electric',
  'ukulele': 'ukulele',
  'cavaquinho': 'cavaquinho',
  'mandolin': 'mandolin',
};
