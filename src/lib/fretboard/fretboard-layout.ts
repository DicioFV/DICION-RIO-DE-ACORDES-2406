/**
 * ============================================================
 * LAYOUT SVG DO BRAÇO
 * ============================================================
 */

export const FRETBOARD_DIMENSIONS = {
  diagram: {
    width: 200,
    height: 240,
    paddingX: 30,
    paddingTop: 40,
    paddingBottom: 30,
    fretSpacing: 36,
    stringSpacing: 28,
    dotRadius: 11,
    nutHeight: 6,
  },
  full: {
    fretWidth: 60,
    stringSpacing: 22,
    paddingX: 40,
    paddingY: 30,
    dotRadius: 10,
    fretMarkerRadius: 4,
  },
};

/**
 * Casas com marcadores tradicionais
 */
export const FRET_MARKERS = [3, 5, 7, 9, 15, 17, 19, 21];
export const DOUBLE_FRET_MARKERS = [12, 24];

/**
 * Calcula largura proporcional de cada traste
 */
export function getFretWidth(fretNumber: number, baseWidth: number): number {
  const ratio = Math.pow(0.94, fretNumber);
  return Math.max(baseWidth * ratio, baseWidth * 0.45);
}
