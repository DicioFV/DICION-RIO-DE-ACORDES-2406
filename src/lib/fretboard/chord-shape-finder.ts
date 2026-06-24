import type { Chord } from '@/lib/music-theory/types';
import type { ChordShape, FretPosition, Tuning, BarreInfo, FretboardInstrument } from './fretboard-types';
import { getNoteAtFret } from './fretboard-engine';
import { assignFingers } from './fingering-engine';
import { getInstrumentSpec } from './instrument-specs';

/**
 * ============================================================
 * BUSCADOR DE SHAPES DE ACORDE
 *
 * Dado um acorde + afinação + instrumento, encontra TODAS as
 * posições tocáveis no braço, em até N regiões diferentes.
 * ============================================================
 */

const MAX_FRET = 15;

interface ShapeCandidate {
  positions: FretPosition[];
  baseFret: number;
  score: number;
}

/**
 * Gera todos os shapes possíveis de um acorde numa afinação
 */
export function findChordShapes(
  chord: Chord,
  tuning: Tuning,
  maxShapes = 5,
  instrument: FretboardInstrument = 'guitar-nylon'
): ChordShape[] {
  const spec = getInstrumentSpec(instrument);
  const chordPitches = new Set(chord.notes.map((n) => n.pitchClass));

  // For mandolin, use logical strings (pairs count as one)
  const stringNotes = spec.isPaired && spec.pairCount
    ? tuning.notes.slice(0, spec.pairCount)
    : tuning.notes;

  const stringCount = stringNotes.length;

  // Adjust stretch for smaller instruments
  const maxStretch = stringCount <= 4 ? 3 : 4;
  const minStringsPlayed = Math.max(2, Math.floor(stringCount * 0.6));

  // Para cada corda, lista casas que produzem notas do acorde
  const stringOptions: { fret: number; pitchClass: number }[][] =
    stringNotes.map((stringNote) => {
      const opts: { fret: number; pitchClass: number }[] = [];
      for (let fret = 0; fret <= MAX_FRET; fret++) {
        try {
          const note = getNoteAtFret(stringNote, fret);
          if (chordPitches.has(note.pitchClass)) {
            opts.push({ fret, pitchClass: note.pitchClass });
          }
        } catch {
          // Skip invalid notes
        }
      }
      return opts;
    });

  const candidates: ShapeCandidate[] = [];

  // Busca por base fret
  for (let startFret = 0; startFret <= 12; startFret++) {
    const positions = tryBuildShape(
      stringOptions,
      stringCount,
      startFret,
      chord,
      maxStretch,
      minStringsPlayed
    );
    if (positions) {
      const score = scoreShape(positions, startFret);
      candidates.push({ positions, baseFret: startFret, score });
    }
  }

  // Ordena por score e remove similares
  candidates.sort((a, b) => b.score - a.score);
  const unique = dedupeShapes(candidates).slice(0, maxShapes);

  const tuningForBuild = { ...tuning, notes: stringNotes };

  return unique.map((c, idx) => {
    const shape = buildChordShape(c, chord, idx, tuningForBuild);
    // For mandolin, expand single positions to paired positions
    if (spec.isPaired && spec.pairCount) {
      return expandPairedShape(shape);
    }
    return shape;
  });
}

/**
 * Tenta construir um shape começando numa base fret
 */
function tryBuildShape(
  stringOptions: { fret: number; pitchClass: number }[][],
  stringCount: number,
  startFret: number,
  chord: Chord,
  maxStretch: number,
  minStringsPlayed: number
): FretPosition[] | null {
  const positions: FretPosition[] = [];
  const chordPitches = new Set(chord.notes.map((n) => n.pitchClass));
  const playedPitches = new Set<number>();

  for (let s = 0; s < stringCount; s++) {
    const opts = stringOptions[s];

    // Filtra: solta (0) ou dentro da janela
    const valid = opts.filter(
      (o) =>
        o.fret === 0 ||
        (startFret === 0 && o.fret <= maxStretch) ||
        (startFret > 0 &&
          o.fret >= startFret &&
          o.fret <= startFret + maxStretch)
    );

    if (valid.length === 0) {
      positions.push({ string: s, fret: -1 }); // muta corda
      continue;
    }

    // Prioriza: notas ainda não tocadas > casa mais baixa
    valid.sort((a, b) => {
      const aNew = !playedPitches.has(a.pitchClass) ? 0 : 1;
      const bNew = !playedPitches.has(b.pitchClass) ? 0 : 1;
      if (aNew !== bNew) return aNew - bNew;
      return a.fret - b.fret;
    });

    const chosen = valid[0];
    positions.push({
      string: s,
      fret: chosen.fret,
      isRoot: chosen.pitchClass === chord.root.pitchClass,
    });
    playedPitches.add(chosen.pitchClass);
  }

  // Verifica se TODAS as notas do acorde estão presentes
  for (const p of chordPitches) {
    if (!playedPitches.has(p)) return null;
  }

  // Verifica se há ao menos minStringsPlayed cordas tocadas
  const playedStrings = positions.filter((p) => p.fret >= 0).length;
  if (playedStrings < minStringsPlayed) return null;

  return positions;
}

/**
 * Pontua um shape (maior = melhor)
 */
function scoreShape(
  positions: FretPosition[],
  baseFret: number
): number {
  let score = 100;

  const muted = positions.filter((p) => p.fret < 0).length;
  score -= muted * 8;

  // Bonus se baixo é a tônica
  const bassNote = positions.find((p) => p.fret >= 0);
  if (bassNote?.isRoot) score += 20;

  // Penaliza shapes muito altos
  score -= baseFret * 0.5;

  // Bonus por cordas soltas
  const openCount = positions.filter((p) => p.fret === 0).length;
  score += openCount * 3;

  // Penaliza muitas cordas mutadas nas graves
  const mutedGraves = positions.slice(0, 2).filter((p) => p.fret < 0).length;
  score -= mutedGraves * 5;

  return score;
}

/**
 * Remove shapes muito similares
 */
function dedupeShapes(candidates: ShapeCandidate[]): ShapeCandidate[] {
  const result: ShapeCandidate[] = [];
  for (const c of candidates) {
    const isSimilar = result.some(
      (r) => Math.abs(r.baseFret - c.baseFret) <= 1
    );
    if (!isSimilar) result.push(c);
  }
  return result;
}

/**
 * Constrói ChordShape final com dedilhado e pestana
 */
function buildChordShape(
  candidate: ShapeCandidate,
  chord: Chord,
  index: number,
  tuning: Tuning
): ChordShape {
  const barres = detectBarres(candidate.positions);
  const withFingers = assignFingers(candidate.positions, barres);

  // Adiciona info de nota e grau
  const enriched = withFingers.map((p) => {
    if (p.fret < 0) return p;

    try {
      const note = getNoteAtFret(tuning.notes[p.string], p.fret);
      const interval =
        ((note.pitchClass - chord.root.pitchClass) % 12 + 12) % 12;
      const degreeMap: Record<number, string> = {
        0: '1', 1: 'b9', 2: '9', 3: 'b3', 4: '3',
        5: '11', 6: 'b5', 7: '5', 8: '#5', 9: '13',
        10: 'b7', 11: '7',
      };

      return {
        ...p,
        note,
        degree: degreeMap[interval],
        isRoot: interval === 0,
      };
    } catch {
      return p;
    }
  });

  const difficulty = computeDifficulty(enriched, barres);

  return {
    id: `${chord.symbol}-shape-${index}`,
    chord,
    positions: enriched,
    barres,
    baseFret: candidate.baseFret,
    shapeName: nameShape(candidate.baseFret, barres.length > 0),
    difficulty,
  };
}

/**
 * Detecta pestanas
 */
function detectBarres(positions: FretPosition[]): BarreInfo[] {
  const byFret = new Map<number, FretPosition[]>();
  for (const p of positions) {
    if (p.fret > 0) {
      if (!byFret.has(p.fret)) byFret.set(p.fret, []);
      byFret.get(p.fret)!.push(p);
    }
  }

  const barres: BarreInfo[] = [];
  const frets = [...byFret.keys()].sort((a, b) => a - b);
  if (frets.length === 0) return barres;

  const lowestFret = frets[0];
  const lowestPositions = byFret.get(lowestFret)!;

  if (lowestPositions.length >= 2) {
    const strings = lowestPositions.map((p) => p.string).sort((a, b) => a - b);
    const minStr = strings[0];
    const maxStr = strings[strings.length - 1];

    let isBarre = true;
    for (let s = minStr; s <= maxStr; s++) {
      const pos = positions.find((p) => p.string === s);
      if (pos && pos.fret < 0) {
        isBarre = false;
        break;
      }
    }

    if (isBarre && maxStr - minStr >= 1) {
      barres.push({
        fret: lowestFret,
        fromString: minStr,
        toString: maxStr,
        finger: 1,
      });
    }
  }

  return barres;
}

function computeDifficulty(
  positions: FretPosition[],
  barres: BarreInfo[]
): ChordShape['difficulty'] {
  const frettedPositions = positions.filter((p) => p.fret > 0);
  if (frettedPositions.length === 0) return 'easy';

  const muted = positions.filter((p) => p.fret < 0).length;
  const frets = frettedPositions.map((p) => p.fret);
  const stretched = Math.max(...frets) - Math.min(...frets);

  if (barres.length > 0 && stretched >= 3) return 'advanced';
  if (barres.length > 0) return 'hard';
  if (stretched >= 4) return 'hard';
  if (muted >= 3) return 'medium';
  if (stretched >= 3) return 'medium';
  return 'easy';
}

function nameShape(baseFret: number, hasBarre: boolean): string {
  if (baseFret === 0 || baseFret === 1) {
    if (!hasBarre) return 'Posição aberta';
    return 'Pestana 1ª casa';
  }
  if (hasBarre) return `Pestana ${baseFret}ª casa`;
  return `Posição ${baseFret}ª casa`;
}

/**
 * Expande posições para pares (bandolim: cada "corda lógica" = 2 reais)
 */
function expandPairedShape(shape: ChordShape): ChordShape {
  const expandedPositions: FretPosition[] = [];
  for (const pos of shape.positions) {
    expandedPositions.push({ ...pos, string: pos.string * 2 });
    expandedPositions.push({ ...pos, string: pos.string * 2 + 1 });
  }
  return { ...shape, positions: expandedPositions };
}
