import type { Chord, Pitch, VoicingType } from '../types';
import { createPitch, noteToMidi } from '../core/pitch';
import { applyInversion } from './inversions';

/**
 * ============================================================
 * VOICINGS — Disposição vertical das vozes
 *
 * - close: vozes próximas (fechado)
 * - open: vozes abertas em mais de uma oitava
 * - drop2: 2ª voz do topo desce uma oitava
 * - drop3: 3ª voz do topo desce uma oitava
 * - drop2and4: 2ª e 4ª do topo descem uma oitava
 * - spread: máxima abertura (cada nota em uma oitava)
 * - rootless-a: sem tônica, tipo A (3-5-7-9 / 7-9-3-5)
 * - rootless-b: sem tônica, tipo B (7-9-3-5 / 3-5-7-9)
 * ============================================================
 */

export function applyVoicing(chord: Chord, type: VoicingType, baseOctave = 4): Chord {
  switch (type) {
    case 'close':
      return applyCloseVoicing(chord, baseOctave);
    case 'open':
      return applyOpenVoicing(chord, baseOctave);
    case 'drop2':
      return applyDropVoicing(chord, [2], baseOctave);
    case 'drop3':
      return applyDropVoicing(chord, [3], baseOctave);
    case 'drop2and4':
      return applyDropVoicing(chord, [2, 4], baseOctave);
    case 'spread':
      return applySpreadVoicing(chord, baseOctave);
    case 'rootless-a':
      return applyRootlessVoicing(chord, 'A', baseOctave);
    case 'rootless-b':
      return applyRootlessVoicing(chord, 'B', baseOctave);
    default:
      return applyInversion(chord, 0, baseOctave);
  }
}

/**
 * Voicing fechado — notas na posição mais próxima possível
 */
function applyCloseVoicing(chord: Chord, baseOctave: number): Chord {
  return { ...applyInversion(chord, 0, baseOctave), voicing: 'close' };
}

/**
 * Voicing aberto: pula uma nota a cada oitava
 */
function applyOpenVoicing(chord: Chord, baseOctave: number): Chord {
  const pitches: Pitch[] = [];
  
  chord.notes.forEach((note, i) => {
    const octave = baseOctave + Math.floor(i / 2);
    pitches.push(createPitch(note, octave));
  });

  // Garante ordem ascendente
  pitches.sort((a, b) => a.midi - b.midi);

  return { ...chord, pitches, voicing: 'open' };
}

/**
 * Drop voicing — abaixa uma oitava as vozes especificadas a partir do topo
 */
function applyDropVoicing(chord: Chord, dropPositions: number[], baseOctave: number): Chord {
  const close = applyInversion(chord, 0, baseOctave);
  if (!close.pitches) return chord;

  const pitches = [...close.pitches];
  const top = pitches.length;

  for (const pos of dropPositions) {
    const idx = top - pos;
    if (idx >= 0 && idx < pitches.length) {
      const p = pitches[idx];
      pitches[idx] = createPitch(p.note, p.octave - 1);
    }
  }

  pitches.sort((a, b) => a.midi - b.midi);

  const voicing: VoicingType = dropPositions.length === 1
    ? (`drop${dropPositions[0]}` as VoicingType)
    : 'drop2and4';

  return { ...chord, pitches, voicing };
}

/**
 * Spread voicing — máxima abertura, cada nota em sua própria oitava
 */
function applySpreadVoicing(chord: Chord, baseOctave: number): Chord {
  const pitches = chord.notes.map((note, i) =>
    createPitch(note, baseOctave + i)
  );

  return { ...chord, pitches, voicing: 'spread' };
}

/**
 * Rootless voicing — remove a tônica (típico em jazz)
 * Tipo A: começa pela 3ª
 * Tipo B: começa pela 7ª
 */
function applyRootlessVoicing(chord: Chord, type: 'A' | 'B', baseOctave: number): Chord {
  const withoutRoot = chord.notes.slice(1);
  
  if (withoutRoot.length === 0) {
    return { ...chord, pitches: [], voicing: type === 'A' ? 'rootless-a' : 'rootless-b' };
  }

  if (type === 'B' && withoutRoot.length >= 3) {
    // Move a 3ª uma oitava acima → 7-9-3-5
    const moved = [...withoutRoot.slice(1), withoutRoot[0]];
    const pitches: Pitch[] = [];
    let lastMidi = -Infinity;

    for (const note of moved) {
      let octave = baseOctave;
      let midi = noteToMidi(note, octave);
      while (midi <= lastMidi) {
        octave++;
        midi = noteToMidi(note, octave);
      }
      pitches.push(createPitch(note, octave));
      lastMidi = midi;
    }

    return { ...chord, notes: moved, pitches, voicing: 'rootless-b' };
  }

  // Tipo A — ordem natural sem tônica
  const pitches: Pitch[] = [];
  let lastMidi = -Infinity;

  for (const note of withoutRoot) {
    let octave = baseOctave;
    let midi = noteToMidi(note, octave);
    while (midi <= lastMidi) {
      octave++;
      midi = noteToMidi(note, octave);
    }
    pitches.push(createPitch(note, octave));
    lastMidi = midi;
  }

  return { ...chord, notes: withoutRoot, pitches, voicing: 'rootless-a' };
}

/**
 * Retorna descrição do voicing em português
 */
export function getVoicingDescription(voicing: VoicingType): string {
  const descriptions: Record<VoicingType, string> = {
    'close': 'Fechado — notas mais próximas possíveis',
    'open': 'Aberto — notas espaçadas em mais de uma oitava',
    'drop2': 'Drop 2 — segunda voz do topo desce uma oitava',
    'drop3': 'Drop 3 — terceira voz do topo desce uma oitava',
    'drop2and4': 'Drop 2 e 4 — segunda e quarta vozes descem uma oitava',
    'spread': 'Espalhado — cada nota em sua própria oitava',
    'rootless-a': 'Rootless A — sem tônica, começa pela 3ª',
    'rootless-b': 'Rootless B — sem tônica, começa pela 7ª',
  };
  return descriptions[voicing] || voicing;
}

/**
 * Retorna todos os voicings disponíveis
 */
export function getAllVoicingTypes(): VoicingType[] {
  return ['close', 'open', 'drop2', 'drop3', 'drop2and4', 'spread', 'rootless-a', 'rootless-b'];
}

/**
 * Verifica se um voicing é adequado para um acorde
 * (ex: rootless só faz sentido para acordes de 4+ notas)
 */
export function isVoicingSuitableForChord(chord: Chord, voicing: VoicingType): boolean {
  const noteCount = chord.notes.length;

  switch (voicing) {
    case 'close':
    case 'open':
    case 'spread':
      return noteCount >= 2;
    case 'drop2':
    case 'drop3':
      return noteCount >= 3;
    case 'drop2and4':
      return noteCount >= 4;
    case 'rootless-a':
    case 'rootless-b':
      return noteCount >= 4;
    default:
      return true;
  }
}
