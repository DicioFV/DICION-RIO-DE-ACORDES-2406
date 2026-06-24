import type { Chord } from '../types';
import { createNote } from '../core/notes';
import { findQuality, CHORD_QUALITIES } from './chord-qualities';
import { buildSlashChord, buildChordWithQuality } from './chord-builder';

/**
 * ============================================================
 * PARSER DE SÍMBOLOS DE ACORDES
 *
 * Tolera variações: Cmaj7 = CM7 = CΔ7 = Cmajor7
 * ============================================================
 */

/**
 * Normaliza símbolo (Δ → maj, etc.)
 */
function normalizeSymbol(input: string): string {
  return input
    .trim()
    .replace(/Δ/g, 'maj')
    .replace(/°/g, 'dim')
    .replace(/ø/g, 'm7b5')
    .replace(/\+/g, 'aug')
    .replace(/Major/gi, 'maj')
    .replace(/Minor/gi, 'm')
    .replace(/min(?!o)/g, 'm'); // min but not mino (in minor)
}

/**
 * Faz parse completo de um símbolo de acorde.
 *
 * @example
 * parseChordSymbol("Cmaj7") → Chord
 * parseChordSymbol("F#m7b5") → Chord
 * parseChordSymbol("C/E") → Chord (slash)
 * parseChordSymbol("G7(#9)") → Chord
 */
export function parseChordSymbol(input: string): Chord {
  const normalized = normalizeSymbol(input);

  // Detecta slash chord
  const slashIdx = normalized.indexOf('/');
  let mainPart = normalized;
  let bassName: string | null = null;

  if (slashIdx > 0) {
    mainPart = normalized.substring(0, slashIdx);
    bassName = normalized.substring(slashIdx + 1);
  }

  // Extrai raiz (nota + acidente)
  const rootMatch = mainPart.match(/^([A-G](?:##|bb|#|b)?)(.*)$/);
  if (!rootMatch) throw new Error(`Acorde inválido: ${input}`);

  const rootName = rootMatch[1];
  let qualityPart = rootMatch[2];

  // Remove parênteses: "7(#9)" → "7#9"
  qualityPart = qualityPart.replace(/[()]/g, '');

  // Tenta encontrar a qualidade — do mais específico ao mais genérico
  const sortedQualities = [...CHORD_QUALITIES].sort(
    (a, b) => b.symbol.length - a.symbol.length
  );

  let matchedQuality = null;

  for (const q of sortedQualities) {
    if (q.symbol === qualityPart) {
      matchedQuality = q;
      break;
    }
    for (const alias of q.aliases) {
      if (alias === qualityPart) {
        matchedQuality = q;
        break;
      }
    }
    if (matchedQuality) break;
  }

  // Se vazio = tríade maior
  if (!matchedQuality && qualityPart === '') {
    matchedQuality = findQuality('');
  }

  if (!matchedQuality) {
    throw new Error(`Qualidade não reconhecida em: "${input}" (parte: "${qualityPart}")`);
  }

  const root = createNote(rootName);
  const chord = buildChordWithQuality(root, matchedQuality);

  if (bassName) {
    return buildSlashChord(chord, createNote(bassName));
  }

  return chord;
}

/**
 * Versão segura que retorna null em vez de lançar erro
 */
export function tryParseChord(input: string): Chord | null {
  try {
    return parseChordSymbol(input);
  } catch {
    return null;
  }
}

/**
 * Verifica se uma string é um símbolo de acorde válido
 */
export function isValidChordSymbol(input: string): boolean {
  return tryParseChord(input) !== null;
}

/**
 * Extrai apenas a nota raiz de um símbolo de acorde
 */
export function extractRoot(input: string): string | null {
  const match = input.match(/^([A-G](?:##|bb|#|b)?)/);
  return match ? match[1] : null;
}

/**
 * Lista de símbolos de acordes mais comuns (para autocompletar)
 */
export function getCommonChordSymbols(rootNote: string): string[] {
  const commonQualities = ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug', 'sus4', 'add9', '9'];
  return commonQualities.map((q) => `${rootNote}${q}`);
}
