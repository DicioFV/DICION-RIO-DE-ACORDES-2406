import type { Chord, Note, HarmonicFunction, HarmonicFunctionResult } from '../types';
import { semitonesBetween, createNote } from '../core/notes';
import { SHARP_NAMES } from '../core/constants';

/**
 * ============================================================
 * FUNÇÃO HARMÔNICA
 * Identifica o papel do acorde em uma tonalidade
 * ============================================================
 */

/**
 * Mapa de graus diatônicos da escala maior
 */
const MAJOR_SCALE_DEGREES: Record<number, { degree: string; func: HarmonicFunction }> = {
  0: { degree: 'I', func: 'tonic' },
  2: { degree: 'ii', func: 'subdominant-rel' },
  4: { degree: 'iii', func: 'tonic-relative' },
  5: { degree: 'IV', func: 'subdominant' },
  7: { degree: 'V', func: 'dominant' },
  9: { degree: 'vi', func: 'tonic-relative' },
  11: { degree: 'vii°', func: 'dominant-rel' },
};

/**
 * Identifica a função harmônica de um acorde numa dada tonalidade
 *
 * @example
 * getHarmonicFunction(buildChord(C, 'maj'), createNote('C')) → { function: 'tonic', degree: 'I' }
 * getHarmonicFunction(buildChord(G, '7'), createNote('C')) → { function: 'dominant', degree: 'V7' }
 */
export function getHarmonicFunction(chord: Chord, keyNote: Note): HarmonicFunctionResult {
  const distance = semitonesBetween(keyNote, chord.root);
  const diatonic = MAJOR_SCALE_DEGREES[distance];

  if (!diatonic) {
    return {
      function: 'unknown',
      degree: '?',
      description: 'Acorde cromático ou de empréstimo modal',
    };
  }

  // Acordes dominantes (7) reforçam função dominante
  const isDominantQuality =
    chord.quality.id === '7' ||
    chord.quality.id === '9' ||
    chord.quality.id === '13';

  const fn = isDominantQuality && diatonic.func === 'dominant' 
    ? 'dominant' 
    : diatonic.func;

  // Ajusta o grau para incluir a qualidade do acorde
  let degree = diatonic.degree;
  if (isDominantQuality && degree === 'V') {
    degree = 'V7';
  }

  return {
    function: fn,
    degree,
    description: describeFunctionInPortuguese(fn),
  };
}

function describeFunctionInPortuguese(fn: HarmonicFunction): string {
  const map: Record<HarmonicFunction, string> = {
    'tonic': 'Tônica — sensação de repouso',
    'subdominant': 'Subdominante — sensação de afastamento',
    'dominant': 'Dominante — sensação de tensão, pede resolução',
    'tonic-relative': 'Tônica relativa — repouso modal',
    'subdominant-rel': 'Subdominante relativa',
    'dominant-rel': 'Dominante relativa',
    'secondary-dom': 'Dominante secundário',
    'unknown': 'Função não diatônica',
  };
  return map[fn];
}

/**
 * Lista todos os campos harmônicos onde um acorde aparece
 * (útil para a página de cada acorde)
 */
export function findKeysContainingChord(chord: Chord): string[] {
  const keys: string[] = [];

  for (let i = 0; i < 12; i++) {
    const keyNote = createNote(SHARP_NAMES[i]);
    const fn = getHarmonicFunction(chord, keyNote);
    
    if (fn.function !== 'unknown') {
      keys.push(`${keyNote.name} (${fn.degree})`);
    }
  }

  return keys;
}

/**
 * Gera o campo harmônico de uma tonalidade maior
 */
export function getMajorFieldChords(keyNote: Note): { degree: string; root: string; quality: string }[] {
  const intervals = [0, 2, 4, 5, 7, 9, 11]; // Graus da escala maior
  const qualities = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
  const degrees = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

  return intervals.map((interval, i) => {
    const pitchClass = (keyNote.pitchClass + interval) % 12;
    return {
      degree: degrees[i],
      root: SHARP_NAMES[pitchClass],
      quality: qualities[i],
    };
  });
}

/**
 * Gera o campo harmônico de uma tonalidade menor natural
 */
export function getMinorFieldChords(keyNote: Note): { degree: string; root: string; quality: string }[] {
  const intervals = [0, 2, 3, 5, 7, 8, 10]; // Graus da escala menor natural
  const qualities = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
  const degrees = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  return intervals.map((interval, i) => {
    const pitchClass = (keyNote.pitchClass + interval) % 12;
    return {
      degree: degrees[i],
      root: SHARP_NAMES[pitchClass],
      quality: qualities[i],
    };
  });
}

/**
 * Verifica se um acorde é dominante secundário
 */
export function isSecondaryDominant(chord: Chord, keyNote: Note): { is: boolean; target?: string } {
  // Dominante secundário = acorde de tipo 7 que resolve em um grau diatônico
  if (chord.quality.id !== '7' && chord.quality.id !== '9') {
    return { is: false };
  }

  // Verifica se a fundamental do acorde está a uma quinta justa de algum grau
  const rootPitch = chord.root.pitchClass;
  const diatonicPitches = [0, 2, 4, 5, 7, 9, 11].map(
    (interval) => (keyNote.pitchClass + interval) % 12
  );

  for (const target of diatonicPitches) {
    const distanceToTarget = (target - rootPitch + 12) % 12;
    if (distanceToTarget === 7) {
      // Está a uma quinta acima do alvo = é V7/x
      return { is: true, target: SHARP_NAMES[target] };
    }
  }

  return { is: false };
}

/**
 * Sugere resolução para um acorde dominante
 */
export function suggestResolution(chord: Chord): string | null {
  if (chord.quality.id !== '7' && chord.quality.id !== '9' && chord.quality.id !== '13') {
    return null;
  }

  // V7 resolve em I (quinta abaixo)
  const resolutionPitch = (chord.root.pitchClass + 5) % 12;
  return SHARP_NAMES[resolutionPitch];
}
