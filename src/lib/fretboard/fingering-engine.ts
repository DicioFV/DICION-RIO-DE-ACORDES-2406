import type { FretPosition, BarreInfo } from './fretboard-types';

/**
 * ============================================================
 * MOTOR DE DEDILHADO
 *
 * Sugere distribuição de dedos baseada em regras pedagógicas.
 * ============================================================
 */

export function assignFingers(
  positions: FretPosition[],
  barres: BarreInfo[] = []
): FretPosition[] {
  // Filtra posições tocadas (não mutadas e não soltas)
  const fretted = positions
    .map((p, i) => ({ ...p, originalIdx: i }))
    .filter((p) => p.fret > 0);

  if (fretted.length === 0) return positions;

  // Mapeia cordas com pestana
  const barreFrets = new Set(barres.map((b) => b.fret));
  const barreStringSet = new Set<string>();
  for (const b of barres) {
    for (let s = b.fromString; s <= b.toString; s++) {
      barreStringSet.add(`${s}-${b.fret}`);
    }
  }

  // Ordena por casa (asc), depois por corda (asc)
  fretted.sort((a, b) => a.fret - b.fret || a.string - b.string);

  const result = [...positions];
  let nextFinger = barres.length > 0 ? 2 : 1;
  const minFret = Math.min(...fretted.map((f) => f.fret));

  for (const p of fretted) {
    const key = `${p.string}-${p.fret}`;

    // Se está na pestana, usa dedo 1
    if (barreStringSet.has(key)) {
      result[p.originalIdx] = { ...result[p.originalIdx], finger: 1 };
      continue;
    }

    // Se na mesma casa da pestana mas não coberto, usa dedo 1
    if (barreFrets.has(p.fret) && p.fret === minFret) {
      result[p.originalIdx] = { ...result[p.originalIdx], finger: 1 };
      continue;
    }

    // Atribui dedos crescentes
    result[p.originalIdx] = {
      ...result[p.originalIdx],
      finger: Math.min(nextFinger, 4),
    };
    nextFinger++;
  }

  return result;
}
