import type { Chord } from '@/lib/music-theory/types';
import type { PlaybackConfig, PlaybackMode, AudioInstrumentId } from './audio-types';
import { applyVoicing, applyInversion, type VoicingType } from '@/lib/music-theory';
import { loadSampler, ensureInitialized, midiToToneNote } from './audio-engine';

/**
 * ============================================================
 * MODOS DE REPRODUÇÃO
 * ============================================================
 */

const DEFAULT_CONFIG: PlaybackConfig = {
  mode: 'block',
  velocity: 0.8,
  tempo: 80,
  sustain: 2.5,
};

interface PlayOptions {
  chord: Chord;
  instrument: AudioInstrumentId;
  config?: Partial<PlaybackConfig>;
  voicing?: string;
  inversion?: number;
  baseOctave?: number;
  onComplete?: () => void;
}

/**
 * Play a chord with the specified configuration
 */
export async function playChord(options: PlayOptions): Promise<void> {
  await ensureInitialized();

  const {
    chord,
    instrument,
    config = {},
    voicing = 'close',
    inversion = 0,
    baseOctave = 4,
    onComplete,
  } = options;

  const cfg: PlaybackConfig = { ...DEFAULT_CONFIG, ...config };

  // Apply voicing/inversion
  let processed = chord;
  if (voicing === 'close') {
    processed = applyInversion(chord, inversion, baseOctave);
  } else {
    processed = applyVoicing(chord, voicing as VoicingType, baseOctave);
  }

  if (!processed.pitches || processed.pitches.length === 0) return;

  const midis = processed.pitches.map((p) => p.midi);
  const sampler = await loadSampler(instrument);

  // Route by mode
  switch (cfg.mode) {
    case 'block':
      playBlock(sampler, midis, cfg);
      break;
    case 'arpeggio-up':
      playArpeggio(sampler, midis, cfg, 'up');
      break;
    case 'arpeggio-down':
      playArpeggio(sampler, midis, cfg, 'down');
      break;
    case 'arpeggio-updown':
      playArpeggio(sampler, midis, cfg, 'updown');
      break;
    case 'strum-down':
      playStrum(sampler, midis, cfg, 'down');
      break;
    case 'strum-up':
      playStrum(sampler, midis, cfg, 'up');
      break;
    default:
      playBlock(sampler, midis, cfg);
  }

  if (onComplete) {
    const duration = estimateDuration(midis.length, cfg);
    setTimeout(onComplete, duration * 1000);
  }
}

/**
 * Play a single note
 */
export async function playNote(
  midi: number,
  instrument: AudioInstrumentId,
  duration = 1,
  velocity = 0.7
): Promise<void> {
  await ensureInitialized();
  const sampler = await loadSampler(instrument);
  const noteName = midiToToneNote(midi);
  sampler.triggerAttackRelease(noteName, duration, undefined, velocity);
}

// ============================================================
// MODE IMPLEMENTATIONS
// ============================================================

function playBlock(sampler: any, midis: number[], cfg: PlaybackConfig): void {
  const notes = midis.map(midiToToneNote);
  sampler.triggerAttackRelease(notes, cfg.sustain, undefined, cfg.velocity);
}

function playArpeggio(
  sampler: any,
  midis: number[],
  cfg: PlaybackConfig,
  direction: 'up' | 'down' | 'updown'
): void {
  let sequence: number[];

  switch (direction) {
    case 'up':
      sequence = [...midis].sort((a, b) => a - b);
      break;
    case 'down':
      sequence = [...midis].sort((a, b) => b - a);
      break;
    case 'updown': {
      const up = [...midis].sort((a, b) => a - b);
      const down = [...up].slice(0, -1).reverse();
      sequence = [...up, ...down];
      break;
    }
  }

  const interval = cfg.tempo / 1000;
  sequence.forEach((midi, i) => {
    const noteName = midiToToneNote(midi);
    const time = i * interval;
    sampler.triggerAttackRelease(
      noteName,
      cfg.sustain * 0.7,
      `+${time}`,
      cfg.velocity
    );
  });
}

function playStrum(
  sampler: any,
  midis: number[],
  cfg: PlaybackConfig,
  direction: 'up' | 'down'
): void {
  const sorted =
    direction === 'down'
      ? [...midis].sort((a, b) => b - a)
      : [...midis].sort((a, b) => a - b);

  const strumSpeed = 0.018;
  sorted.forEach((midi, i) => {
    const noteName = midiToToneNote(midi);
    sampler.triggerAttackRelease(
      noteName,
      cfg.sustain,
      `+${i * strumSpeed}`,
      cfg.velocity
    );
  });
}

function estimateDuration(noteCount: number, cfg: PlaybackConfig): number {
  switch (cfg.mode) {
    case 'block':
    case 'strum-down':
    case 'strum-up':
      return cfg.sustain;
    case 'arpeggio-up':
    case 'arpeggio-down':
      return (noteCount * cfg.tempo) / 1000 + cfg.sustain * 0.5;
    case 'arpeggio-updown':
      return ((noteCount * 2 - 1) * cfg.tempo) / 1000 + cfg.sustain * 0.5;
    default:
      return cfg.sustain;
  }
}

/**
 * Friendly labels for playback modes
 */
export const PLAYBACK_MODE_LABELS: Record<
  PlaybackMode,
  { label: string; emoji: string; description: string }
> = {
  'block': {
    label: 'Bloco',
    emoji: '⏹️',
    description: 'Todas as notas juntas',
  },
  'arpeggio-up': {
    label: 'Arpejo ↑',
    emoji: '↗️',
    description: 'Sequência ascendente',
  },
  'arpeggio-down': {
    label: 'Arpejo ↓',
    emoji: '↘️',
    description: 'Sequência descendente',
  },
  'arpeggio-updown': {
    label: 'Sobe/Desce',
    emoji: '🔄',
    description: 'Arpejo sobe e desce',
  },
  'strum-down': {
    label: 'Rasgueio ↓',
    emoji: '⬇️',
    description: 'Rasgueio para baixo',
  },
  'strum-up': {
    label: 'Rasgueio ↑',
    emoji: '⬆️',
    description: 'Rasgueio para cima',
  },
  'note-by-note': {
    label: 'Nota a Nota',
    emoji: '🎯',
    description: 'Clique em cada nota',
  },
};

/**
 * Get all playable modes (excludes note-by-note which is interactive)
 */
export function getPlayableModes(): PlaybackMode[] {
  return [
    'block',
    'arpeggio-up',
    'arpeggio-down',
    'arpeggio-updown',
    'strum-down',
    'strum-up',
  ];
}
