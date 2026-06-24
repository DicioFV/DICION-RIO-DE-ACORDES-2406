import type { Chord, Pitch } from '../types';
import { createPitch, noteToMidi } from '../core/pitch';

/**
 * ============================================================
 * INVERSÕES
 *
 * 0 = Fundamental (raiz no baixo)
 * 1 = 1ª Inversão (terça no baixo)
 * 2 = 2ª Inversão (quinta no baixo)
 * 3 = 3ª Inversão (sétima no baixo) — quando aplicável
 * ============================================================
 */

/**
 * Gera todas as inversões possíveis de um acorde
 */
export function getInversions(chord: Chord): Chord[] {
  const inversions: Chord[] = [];
  const noteCount = chord.notes.length;

  for (let i = 0; i < noteCount; i++) {
    const rotated = [
      ...chord.notes.slice(i),
      ...chord.notes.slice(0, i),
    ];

    inversions.push({
      ...chord,
      notes: rotated,
      inversion: i,
      bass: rotated[0],
    });
  }

  return inversions;
}

/**
 * Aplica uma inversão específica e gera pitches absolutos
 * (notas com oitavas, sem cruzamento)
 */
export function applyInversion(chord: Chord, inversion: number, baseOctave = 4): Chord {
  const inversions = getInversions(chord);
  const target = inversions[inversion % inversions.length];

  // Gera pitches sequenciais ascendentes
  const pitches: Pitch[] = [];
  let lastMidi = -Infinity;

  for (const note of target.notes) {
    let octave = baseOctave;
    let midi = noteToMidi(note, octave);

    while (midi <= lastMidi) {
      octave++;
      midi = noteToMidi(note, octave);
    }

    pitches.push(createPitch(note, octave));
    lastMidi = midi;
  }

  return { ...target, pitches };
}

/**
 * Retorna o número máximo de inversões possíveis para um acorde
 */
export function getMaxInversions(chord: Chord): number {
  return chord.notes.length;
}

/**
 * Retorna o nome da inversão em português
 */
export function getInversionName(inversion: number): string {
  const names = [
    'Estado Fundamental',
    '1ª Inversão',
    '2ª Inversão',
    '3ª Inversão',
    '4ª Inversão',
    '5ª Inversão',
    '6ª Inversão',
  ];
  return names[inversion] || `${inversion}ª Inversão`;
}

/**
 * Retorna qual intervalo está no baixo para cada inversão
 */
export function getBassInterval(chord: Chord, inversion: number): string {
  const inversions = getInversions(chord);
  const target = inversions[inversion % inversions.length];
  
  if (!target.notes.length) return '';
  
  // Encontra o intervalo correspondente à nota do baixo
  const bassNote = target.notes[0];
  const originalIndex = chord.notes.findIndex(n => n.pitchClass === bassNote.pitchClass);
  
  if (originalIndex >= 0 && chord.intervals[originalIndex]) {
    return chord.intervals[originalIndex].name;
  }
  
  return '';
}
