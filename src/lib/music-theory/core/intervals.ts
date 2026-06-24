import type { Interval, IntervalQuality, IntervalNumber, Note } from '../types';
import { LETTER_TO_PITCH, LETTERS_ORDER } from './constants';

/**
 * ============================================================
 * SISTEMA DE INTERVALOS
 * ============================================================
 */

/**
 * Tabela de semitons para cada combinação qualidade+número (até 13ª)
 */
const INTERVAL_SEMITONES: Record<string, number> = {
  // 1ª
  'P1': 0,
  'A1': 1,
  'd1': -1,
  // 2ª
  'd2': 0,
  'm2': 1,
  'M2': 2,
  'A2': 3,
  // 3ª
  'd3': 2,
  'm3': 3,
  'M3': 4,
  'A3': 5,
  // 4ª
  'd4': 4,
  'P4': 5,
  'A4': 6,
  // 5ª
  'd5': 6,
  'P5': 7,
  'A5': 8,
  // 6ª
  'd6': 7,
  'm6': 8,
  'M6': 9,
  'A6': 10,
  // 7ª
  'd7': 9,
  'm7': 10,
  'M7': 11,
  'A7': 12,
  // 8ª
  'd8': 11,
  'P8': 12,
  'A8': 13,
  // 9ª
  'd9': 12,
  'm9': 13,
  'M9': 14,
  'A9': 15,
  // 10ª
  'm10': 15,
  'M10': 16,
  // 11ª
  'd11': 16,
  'P11': 17,
  'A11': 18,
  // 12ª
  'd12': 18,
  'P12': 19,
  // 13ª
  'd13': 19,
  'm13': 20,
  'M13': 21,
  'A13': 22,
};

/**
 * Cria um intervalo a partir do nome
 * Ex: createInterval("M3") → { quality: 'M', number: 3, semitones: 4 }
 */
export function createInterval(name: string): Interval {
  const match = name.match(/^([PMmAd])(\d{1,2})$/);
  if (!match) throw new Error(`Intervalo inválido: ${name}`);

  const quality = match[1] as IntervalQuality;
  const number = parseInt(match[2], 10) as IntervalNumber;
  const semitones = INTERVAL_SEMITONES[name];

  if (semitones === undefined) {
    throw new Error(`Intervalo não suportado: ${name}`);
  }

  // Notação brasileira: 3M, 5J, 7m, etc.
  const brQuality: Record<IntervalQuality, string> = {
    P: 'J',
    M: 'M',
    m: 'm',
    A: 'A',
    d: 'd',
  };
  const shortName = `${number}${brQuality[quality]}`;

  return { name, quality, number, semitones, shortName };
}

/**
 * Aplica um intervalo a uma nota → retorna a nota resultante COM letra correta
 * (respeitando a teoria: C + M3 = E, C + d5 = Gb)
 */
export function applyInterval(root: Note, interval: Interval): Note {
  // 1. Calcula a letra resultante (avança N letras na escala)
  const rootLetterIdx = LETTERS_ORDER.indexOf(root.letter);
  const targetLetterIdx = (rootLetterIdx + interval.number - 1) % 7;
  const targetLetter = LETTERS_ORDER[targetLetterIdx];

  // 2. Calcula pitch class esperado
  const rootPitch = root.pitchClass;
  const expectedPitch = ((rootPitch + interval.semitones) % 12 + 12) % 12;

  // 3. Pitch natural da letra alvo
  const naturalPitch = LETTER_TO_PITCH[targetLetter];

  // 4. Diferença determina o acidente
  let diff = expectedPitch - naturalPitch;
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;

  const accidentalMap: Record<number, string> = {
    [-2]: 'bb',
    [-1]: 'b',
    [0]: '',
    [1]: '#',
    [2]: '##',
  };

  const accidental = accidentalMap[diff] ?? '';
  const noteName = `${targetLetter}${accidental}`;

  return {
    name: noteName,
    letter: targetLetter,
    accidental: accidental as Note['accidental'],
    pitchClass: ((expectedPitch) % 12 + 12) % 12,
  };
}

/**
 * Identifica o intervalo entre duas notas (considerando a grafia)
 */
export function intervalBetween(from: Note, to: Note): Interval {
  const fromLetterIdx = LETTERS_ORDER.indexOf(from.letter);
  const toLetterIdx = LETTERS_ORDER.indexOf(to.letter);

  let letterDiff = toLetterIdx - fromLetterIdx;
  if (letterDiff < 0) letterDiff += 7;
  const number = (letterDiff + 1) as IntervalNumber;

  let semitones = to.pitchClass - from.pitchClass;
  if (semitones < 0) semitones += 12;

  // Encontra qualidade correspondente
  for (const name of Object.keys(INTERVAL_SEMITONES)) {
    const interval = createInterval(name);
    if (interval.number === number && interval.semitones === semitones) {
      return interval;
    }
  }

  throw new Error(`Não foi possível identificar o intervalo entre ${from.name} e ${to.name}`);
}

/**
 * Retorna o intervalo invertido (complemento para oitava)
 * Ex: M3 → m6, P5 → P4
 */
export function invertInterval(interval: Interval): Interval {
  const complementNumber = (9 - interval.number) as IntervalNumber;
  
  const qualityMap: Record<IntervalQuality, IntervalQuality> = {
    'P': 'P',
    'M': 'm',
    'm': 'M',
    'A': 'd',
    'd': 'A',
  };
  
  const newQuality = qualityMap[interval.quality];
  const newName = `${newQuality}${complementNumber}`;
  
  return createInterval(newName);
}

/**
 * Lista de intervalos comuns para referência
 */
export const COMMON_INTERVALS = {
  unisson: 'P1',
  minor2: 'm2',
  major2: 'M2',
  minor3: 'm3',
  major3: 'M3',
  perfect4: 'P4',
  tritone: 'A4',
  diminished5: 'd5',
  perfect5: 'P5',
  minor6: 'm6',
  major6: 'M6',
  minor7: 'm7',
  major7: 'M7',
  octave: 'P8',
  minor9: 'm9',
  major9: 'M9',
  perfect11: 'P11',
  sharp11: 'A11',
  minor13: 'm13',
  major13: 'M13',
} as const;

/**
 * Descrições em português dos intervalos
 */
export const INTERVAL_NAMES_PT: Record<string, string> = {
  'P1': 'Uníssono',
  'm2': 'Segunda menor',
  'M2': 'Segunda maior',
  'm3': 'Terça menor',
  'M3': 'Terça maior',
  'P4': 'Quarta justa',
  'A4': 'Quarta aumentada (trítono)',
  'd5': 'Quinta diminuta (trítono)',
  'P5': 'Quinta justa',
  'm6': 'Sexta menor',
  'M6': 'Sexta maior',
  'm7': 'Sétima menor',
  'M7': 'Sétima maior',
  'P8': 'Oitava',
  'm9': 'Nona menor',
  'M9': 'Nona maior',
  'P11': 'Décima-primeira justa',
  'A11': 'Décima-primeira aumentada',
  'm13': 'Décima-terceira menor',
  'M13': 'Décima-terceira maior',
};
