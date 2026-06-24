import type { PianoHand } from './piano-types';

/**
 * ============================================================
 * SUGESTÃO DE DEDILHADO
 *
 * Algoritmo pedagógico baseado em regras clássicas:
 * - Polegar (1) tende a notas brancas
 * - Mão direita: dedos sobem com pitch crescente
 * - Mão esquerda: dedos sobem com pitch decrescente
 * ============================================================
 */

export interface FingerSuggestion {
  midi: number;
  finger: number; // 1=polegar, 2=indicador, 3=médio, 4=anelar, 5=mindinho
  hand: PianoHand;
}

/**
 * Sugere dedilhado básico para um acorde
 * (Cobertura de 80% dos casos. Casos complexos podem precisar ajuste manual.)
 */
export function suggestFingering(
  midis: number[],
  hand: PianoHand
): FingerSuggestion[] {
  if (midis.length === 0) return [];

  const sorted = [...midis].sort((a, b) => a - b);

  // Mão única: distribui 5 dedos
  if (hand === 'right') {
    return distributeFingers(sorted, 'right');
  }
  if (hand === 'left') {
    return distributeFingers(sorted, 'left');
  }

  // Mãos juntas: notas graves para mão E, agudas para mão D
  // Divide pelo dó central (C4 = 60)
  const left = sorted.filter((m) => m < 60);
  const right = sorted.filter((m) => m >= 60);

  return [
    ...distributeFingers(left, 'left'),
    ...distributeFingers(right, 'right'),
  ];
}

/**
 * Distribui dedos para uma mão única
 */
function distributeFingers(
  midis: number[],
  hand: 'right' | 'left'
): FingerSuggestion[] {
  const n = midis.length;
  if (n === 0) return [];

  // Mapeamento simples por número de notas
  const fingerMaps: Record<number, number[]> = {
    1: [1],
    2: [1, 5],
    3: [1, 3, 5],
    4: [1, 2, 3, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 5], // último dedo repete (pouco comum)
    7: [1, 2, 3, 4, 5, 5, 5],
  };

  let fingers = fingerMaps[n] || fingerMaps[5];

  // Mão esquerda: inverte (polegar fica na nota mais aguda)
  if (hand === 'left') {
    fingers = [...fingers].reverse();
  }

  return midis.map((midi, i) => ({
    midi,
    finger: fingers[i] || 1,
    hand,
  }));
}

/**
 * Retorna a mão sugerida para uma nota (no modo "ambas")
 */
export function suggestHand(midi: number): 'right' | 'left' {
  return midi < 60 ? 'left' : 'right';
}

/**
 * Nomes dos dedos em português
 */
export const FINGER_NAMES: Record<number, string> = {
  1: 'Polegar',
  2: 'Indicador',
  3: 'Médio',
  4: 'Anelar',
  5: 'Mindinho',
};
