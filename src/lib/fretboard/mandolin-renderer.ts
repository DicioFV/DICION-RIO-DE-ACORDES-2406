/**
 * ============================================================
 * RENDERIZAÇÃO ESPECIAL DO BANDOLIM
 *
 * Bandolim tem 8 cordas em 4 PARES (cada par produz mesma nota).
 * Pares ficam visualmente próximos, com espaçamento maior entre pares.
 * ============================================================
 */

export interface PairedStringLayout {
  realStringIdx: number;
  pairIdx: number;
  positionInPair: 0 | 1;
  x: number;
}

const PAIR_INNER_GAP = 6;
const PAIR_OUTER_GAP = 22;

/**
 * Calcula posições X das 8 cordas do bandolim
 */
export function calculateMandolinStringPositions(
  startX: number
): PairedStringLayout[] {
  const result: PairedStringLayout[] = [];
  let x = startX;

  for (let pair = 0; pair < 4; pair++) {
    for (let pos = 0; pos < 2; pos++) {
      result.push({
        realStringIdx: pair * 2 + pos,
        pairIdx: pair,
        positionInPair: pos as 0 | 1,
        x,
      });
      if (pos === 0) x += PAIR_INNER_GAP;
    }
    if (pair < 3) x += PAIR_OUTER_GAP;
  }

  return result;
}

/**
 * Largura total do braço do bandolim
 */
export function getMandolinTotalStringWidth(): number {
  return 4 * PAIR_INNER_GAP + 3 * PAIR_OUTER_GAP;
}
