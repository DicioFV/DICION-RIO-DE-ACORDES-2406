import type { Chord, ChordAnalysisResult, Note } from '../types';
import { CHORD_QUALITIES } from './chord-qualities';
import { buildChord } from './chord-builder';

/**
 * ============================================================
 * ANÁLISE REVERSA
 * Dado um conjunto de notas, identifica o acorde mais provável
 * ============================================================
 */

/**
 * Identifica todos os acordes possíveis a partir de um conjunto de notas
 * Retorna ordenado por confiança decrescente.
 *
 * @example
 * analyzeChord([C, E, G]) → [{ chord: C, confidence: 1.0 }]
 * analyzeChord([E, G, C]) → [{ chord: C/E, confidence: 0.95 }, ...]
 * analyzeChord([C, E, G, B]) → [{ chord: Cmaj7, confidence: 1.0 }]
 */
export function analyzeChord(notes: Note[]): ChordAnalysisResult[] {
  if (notes.length < 2) return [];

  const results: ChordAnalysisResult[] = [];
  const uniquePitches = Array.from(new Set(notes.map((n) => n.pitchClass)));

  // Tenta cada nota como tônica
  for (const possibleRoot of notes) {
    for (const quality of CHORD_QUALITIES) {
      try {
        const candidate = buildChord(possibleRoot, quality.id);
        const candidatePitches = candidate.notes.map((n) => n.pitchClass);

        // Cálculo de match
        const match = calculateMatch(uniquePitches, candidatePitches);

        if (match.confidence >= 0.7) {
          // Determina inversão pelo baixo (nota mais grave do input)
          const bassPitch = notes[0].pitchClass;
          const rootIdx = candidatePitches.indexOf(bassPitch);
          const inversion = rootIdx >= 0 ? rootIdx : 0;

          results.push({
            chord: candidate,
            confidence: match.confidence,
            inversion,
            alternativeNames: [],
          });
        }
      } catch {
        // Ignora erros de construção
      }
    }
  }

  // Ordena por confiança e remove duplicatas
  results.sort((a, b) => b.confidence - a.confidence);

  // Remove acordes com mesmo símbolo (mantém o de maior confiança)
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    if (seen.has(r.chord.symbol)) return false;
    seen.add(r.chord.symbol);
    return true;
  });

  return unique.slice(0, 5); // top 5
}

interface MatchResult {
  confidence: number;
  matched: number;
  total: number;
}

function calculateMatch(input: number[], candidate: number[]): MatchResult {
  const inputSet = new Set(input);
  const candidateSet = new Set(candidate);

  let matched = 0;
  for (const p of candidateSet) {
    if (inputSet.has(p)) matched++;
  }

  // Penalidade por notas extras no input que não estão no candidato
  const extras = input.filter((p) => !candidateSet.has(p)).length;

  // Penalidade por notas faltantes no input
  const missing = candidate.filter((p) => !inputSet.has(p)).length;

  // Confiança: match perfeito = 1.0; extras e missing diminuem
  const matchRatio = matched / candidate.length;
  const completeness = 1 - (missing / candidate.length) * 0.5;
  const purity = 1 - (extras / Math.max(input.length, 1)) * 0.3;

  return {
    confidence: matchRatio * completeness * purity,
    matched,
    total: candidate.length,
  };
}

/**
 * Análise rápida: retorna apenas o melhor candidato
 */
export function bestChordMatch(notes: Note[]): Chord | null {
  const results = analyzeChord(notes);
  return results[0]?.chord || null;
}

/**
 * Verifica se um conjunto de notas forma um acorde específico
 */
export function notesMatchChord(notes: Note[], chord: Chord): boolean {
  const notePitches = new Set(notes.map((n) => n.pitchClass));
  const chordPitches = new Set(chord.notes.map((n) => n.pitchClass));

  if (notePitches.size !== chordPitches.size) return false;

  for (const pitch of chordPitches) {
    if (!notePitches.has(pitch)) return false;
  }

  return true;
}

/**
 * Encontra a inversão de um acorde que corresponde a um conjunto de notas
 */
export function findMatchingInversion(notes: Note[], chord: Chord): number {
  if (notes.length === 0) return 0;

  const bassPitch = notes[0].pitchClass;
  const chordPitches = chord.notes.map((n) => n.pitchClass);
  const inversion = chordPitches.indexOf(bassPitch);

  return inversion >= 0 ? inversion : 0;
}

/**
 * Gera nomes alternativos para um acorde
 * Ex: Cm7 também pode ser escrito como C-7 ou Cmin7
 */
export function getAlternativeNames(chord: Chord): string[] {
  const root = chord.root.name;
  const aliases = chord.quality.aliases;

  return aliases.map((alias) => `${root}${alias}`);
}
