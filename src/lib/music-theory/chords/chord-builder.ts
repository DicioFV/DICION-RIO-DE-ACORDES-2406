import type { Chord, ChordQuality, Note } from '../types';
import { createNote, getPreferredName } from '../core/notes';
import { applyInterval, createInterval } from '../core/intervals';
import { findQualityById } from './chord-qualities';

/**
 * ============================================================
 * CONSTRUTOR DE ACORDES
 * ============================================================
 */

/**
 * Constrói um acorde a partir de uma nota raiz e uma qualidade.
 *
 * @example
 * buildChord(createNote('C'), 'maj7')
 * → { symbol: 'Cmaj7', notes: [C, E, G, B], ... }
 */
export function buildChord(root: Note, qualityId: string): Chord {
  const quality = findQualityById(qualityId);
  if (!quality) throw new Error(`Qualidade desconhecida: ${qualityId}`);

  const intervals = quality.intervals.map(createInterval);
  const notes = intervals.map((iv) => applyInterval(root, iv));

  return {
    symbol: `${root.name}${quality.symbol}`,
    root,
    quality,
    notes,
    intervals,
    inversion: 0,
  };
}

/**
 * Constrói um acorde a partir de uma qualidade já resolvida
 */
export function buildChordWithQuality(root: Note, quality: ChordQuality): Chord {
  const intervals = quality.intervals.map(createInterval);
  const notes = intervals.map((iv) => applyInterval(root, iv));

  return {
    symbol: `${root.name}${quality.symbol}`,
    root,
    quality,
    notes,
    intervals,
    inversion: 0,
  };
}

/**
 * Constrói acorde com slash (baixo invertido ou estranho à harmonia)
 * Ex: "C/E" → C maior com E no baixo
 * Ex: "C/Bb" → C maior com Bb no baixo (cria sonoridade de C7)
 */
export function buildSlashChord(rootChord: Chord, bassNote: Note): Chord {
  return {
    ...rootChord,
    symbol: `${rootChord.symbol}/${bassNote.name}`,
    bass: bassNote,
  };
}

/**
 * Renomeia notas do acorde para usar bemóis ou sustenidos baseado no contexto
 */
export function applyEnharmonicContext(chord: Chord, contextKey?: string): Chord {
  if (!contextKey) return chord;

  const newNotes = chord.notes.map((n) =>
    createNote(getPreferredName(n.pitchClass, contextKey))
  );

  return { ...chord, notes: newNotes };
}

/**
 * Gera o símbolo completo do acorde
 */
export function getChordSymbol(chord: Chord): string {
  let symbol = `${chord.root.name}${chord.quality.symbol}`;
  if (chord.bass && chord.bass.name !== chord.root.name) {
    symbol += `/${chord.bass.name}`;
  }
  return symbol;
}

/**
 * Gera descrição textual do acorde
 */
export function getChordDescription(chord: Chord): string {
  const rootName = chord.root.name;
  const qualityName = chord.quality.fullName;
  let description = `${rootName} ${qualityName}`;
  
  if (chord.bass && chord.bass.name !== chord.root.name) {
    description += ` com ${chord.bass.name} no baixo`;
  }
  
  if (chord.inversion && chord.inversion > 0) {
    const inversionNames = ['', '1ª inversão', '2ª inversão', '3ª inversão'];
    description += ` (${inversionNames[chord.inversion] || `${chord.inversion}ª inversão`})`;
  }
  
  return description;
}

/**
 * Retorna a fórmula do acorde em formato legível
 * Ex: "1 3 5 7" para maj7
 */
export function getChordFormula(chord: Chord): string {
  const formulaMap: Record<string, string> = {
    'P1': '1',
    'M2': '2',
    'm3': 'b3',
    'M3': '3',
    'P4': '4',
    'd5': 'b5',
    'P5': '5',
    'A5': '#5',
    'M6': '6',
    'd7': 'bb7',
    'm7': 'b7',
    'M7': '7',
    'm9': 'b9',
    'M9': '9',
    'A9': '#9',
    'P11': '11',
    'A11': '#11',
    'm13': 'b13',
    'M13': '13',
  };

  return chord.quality.intervals
    .map((iv) => formulaMap[iv] || iv)
    .join(' ');
}
