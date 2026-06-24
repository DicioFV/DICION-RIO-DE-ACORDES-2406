import type { Chord } from '@/lib/music-theory/types';
import { applyVoicing, applyInversion, type VoicingType } from '@/lib/music-theory';
import type {
  PianoKeyData,
  PianoState,
  PianoDisplayMode,
} from './piano-types';
import { isBlackKey, midiToNoteName, midiToOctave } from './piano-layout';
import { suggestFingering, suggestHand } from './piano-fingering';

/**
 * ============================================================
 * MOTOR LÓGICO DO PIANO
 *
 * Recebe um acorde + estado → produz lista de teclas a renderizar
 * ============================================================
 */

/**
 * Calcula quais MIDIs estão ativos para o acorde + voicing + inversão
 */
export function computeActiveMidis(
  chord: Chord | null,
  voicing: string,
  inversion: number,
  baseOctave = 4
): number[] {
  if (!chord) return [];

  let processed = chord;

  // Aplica voicing (que internamente já aplica inversão se needed)
  if (voicing === 'close') {
    processed = applyInversion(chord, inversion, baseOctave);
  } else {
    processed = applyVoicing(chord, voicing as VoicingType, baseOctave);
  }

  if (!processed.pitches) return [];

  return processed.pitches.map((p) => p.midi);
}

/**
 * Gera lista de dados de teclas para renderização
 */
export function generateKeysData(
  state: PianoState,
  startMidi: number,
  endMidi: number
): PianoKeyData[] {
  const keys: PianoKeyData[] = [];
  const { chord, activeKeys, config } = state;

  const fingerings = chord
    ? suggestFingering(activeKeys, config.hand)
    : [];
  const fingerMap = new Map(fingerings.map((f) => [f.midi, f]));

  const activeSet = new Set(activeKeys);
  const rootPitchClass = chord?.root.pitchClass;
  const bassPitchClass = chord?.bass?.pitchClass ?? rootPitchClass;
  const lowestActive = activeKeys.length > 0 ? Math.min(...activeKeys) : -1;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const pitchClass = midi % 12;
    const octave = midiToOctave(midi);

    const isActive = activeSet.has(midi);
    const isRoot = isActive && pitchClass === rootPitchClass;
    const isBass =
      isActive && pitchClass === bassPitchClass && midi === lowestActive;

    const fingering = fingerMap.get(midi);
    const degree =
      isActive && chord ? getDegreeLabel(chord, pitchClass) : undefined;

    const noteName = midiToNoteName(midi);
    const label = isActive
      ? buildKeyLabel(config.displayMode, noteName, degree, fingering?.finger)
      : config.displayMode === 'note-names' && !isBlackKey(midi)
      ? noteName
      : undefined;

    keys.push({
      midi,
      pitch: {
        note: {
          name: noteName,
          letter: noteName[0] as 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B',
          accidental: noteName.includes('#') ? '#' : '',
          pitchClass,
        },
        octave,
        midi,
        frequency: 440 * Math.pow(2, (midi - 69) / 12),
      },
      isBlack: isBlackKey(midi),
      isActive,
      isRoot,
      isBass,
      degree,
      finger: fingering?.finger,
      label,
      hand: fingering?.hand ?? (isActive ? suggestHand(midi) : undefined),
    });
  }

  return keys;
}

/**
 * Calcula grau de uma nota dentro do acorde
 * Ex: em Cmaj7, E = "3", G = "5", B = "7"
 */
function getDegreeLabel(chord: Chord, pitchClass: number): string {
  const intervalToDegree: Record<number, string> = {
    0: '1',
    1: 'b9',
    2: '9',
    3: 'b3',
    4: '3',
    5: '11',
    6: 'b5',
    7: '5',
    8: '#5',
    9: '13',
    10: 'b7',
    11: '7',
  };

  const rootPc = chord.root.pitchClass;
  const interval = ((pitchClass - rootPc) % 12 + 12) % 12;
  return intervalToDegree[interval] || '?';
}

/**
 * Constrói o label exibido sobre a tecla ativa
 */
function buildKeyLabel(
  mode: PianoDisplayMode,
  noteName: string,
  degree?: string,
  finger?: number
): string | undefined {
  switch (mode) {
    case 'note-names':
      return noteName;
    case 'degrees':
      return degree;
    case 'fingering':
      return finger ? String(finger) : undefined;
    case 'none':
      return undefined;
    default:
      return noteName;
  }
}
