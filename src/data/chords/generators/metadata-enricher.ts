import type { ChordEntry } from '../chord-schema';
import {
  translateCategory,
  translateComplexity,
} from '@/data/content/chord-descriptions';

/**
 * ============================================================
 * ENRIQUECEDOR DE METADADOS
 * Adiciona conteúdo pedagógico, relações e exemplos
 * ============================================================
 */

export function enrichChords(chords: ChordEntry[]): ChordEntry[] {
  const enriched = chords.map(enrichSingle);
  
  // Segunda passada: encontra relações entre acordes
  findRelationships(enriched);
  
  return enriched;
}

function enrichSingle(chord: ChordEntry): ChordEntry {
  return {
    ...chord,
    longDescription: generateLongDescription(chord),
  };
}

function generateLongDescription(chord: ChordEntry): string {
  if (chord.isPolychord) {
    return `O poliacorde ${chord.symbol} é uma estrutura harmônica avançada que combina dois acordes sobrepostos. ${chord.shortDescription} Este tipo de acorde é característico do jazz moderno e da música de fusão, oferecendo cores harmônicas únicas e tensões específicas.`;
  }

  if (chord.isSlashChord) {
    return `O acorde ${chord.symbol} é um slash chord que combina as notas de ${chord.root.name} ${chord.qualityName} com a nota ${chord.bass?.name || ''} no baixo. Esta configuração cria uma sonoridade única, comum em arranjos de ${chord.styles.slice(0, 3).join(', ')}.`;
  }

  const notas = chord.notes.map((n) => n.name).join(', ');
  const intervalos = chord.intervals.map((i) => i.shortName).join(' - ');

  return `O acorde ${chord.displayName} (${chord.symbol}) é formado pelas notas ${notas}${
    intervalos ? `, que correspondem aos intervalos ${intervalos} a partir da nota fundamental` : ''
  }. ${chord.shortDescription}

Este acorde pertence à categoria de acordes ${translateCategory(chord.category).toLowerCase()} e possui nível de complexidade ${translateComplexity(chord.complexity).toLowerCase()}.${
    chord.styles.length > 0
      ? ` É comumente utilizado em estilos como ${chord.styles.join(', ')}.`
      : ''
  }`;
}

/**
 * Encontra relações entre acordes
 * - Acordes relacionados: mesma qualidade em outras tonalidades
 * - Substitutos: tritone substitution, relative, etc.
 */
function findRelationships(chords: ChordEntry[]): void {
  // Agrupa por qualidade
  const byQuality = new Map<string, ChordEntry[]>();
  for (const chord of chords) {
    if (!byQuality.has(chord.qualityId)) {
      byQuality.set(chord.qualityId, []);
    }
    byQuality.get(chord.qualityId)!.push(chord);
  }

  // Para cada acorde, encontra relacionados
  for (const chord of chords) {
    // Acordes da mesma qualidade (limita a 5)
    const sameQuality = byQuality.get(chord.qualityId) || [];
    chord.relatedChordIds = sameQuality
      .filter((c) => c.id !== chord.id)
      .slice(0, 5)
      .map((c) => c.id);

    // Substitutos (simplificado)
    chord.substituteChordIds = findSubstitutes(chord, chords);
  }
}

/**
 * Encontra possíveis substitutos para um acorde
 */
function findSubstitutes(chord: ChordEntry, allChords: ChordEntry[]): string[] {
  const substitutes: string[] = [];

  // Para dominantes (7), adiciona tritone substitution
  if (chord.qualityId === '7') {
    const tritoneRoot = (chord.root.pitchClass + 6) % 12;
    const tritoneChord = allChords.find(
      (c) => c.qualityId === '7' && c.root.pitchClass === tritoneRoot && !c.isSlashChord
    );
    if (tritoneChord) {
      substitutes.push(tritoneChord.id);
    }
  }

  // Para maiores, adiciona relativa menor
  if (chord.qualityId === 'maj' || chord.qualityId === 'maj7') {
    const relativeMinorRoot = (chord.root.pitchClass + 9) % 12;
    const relativeQuality = chord.qualityId === 'maj' ? 'min' : 'm7';
    const relativeChord = allChords.find(
      (c) =>
        c.qualityId === relativeQuality &&
        c.root.pitchClass === relativeMinorRoot &&
        !c.isSlashChord
    );
    if (relativeChord) {
      substitutes.push(relativeChord.id);
    }
  }

  // Para menores, adiciona relativa maior
  if (chord.qualityId === 'min' || chord.qualityId === 'm7') {
    const relativeMajorRoot = (chord.root.pitchClass + 3) % 12;
    const relativeQuality = chord.qualityId === 'min' ? 'maj' : 'maj7';
    const relativeChord = allChords.find(
      (c) =>
        c.qualityId === relativeQuality &&
        c.root.pitchClass === relativeMajorRoot &&
        !c.isSlashChord
    );
    if (relativeChord) {
      substitutes.push(relativeChord.id);
    }
  }

  return substitutes.slice(0, 3);
}
