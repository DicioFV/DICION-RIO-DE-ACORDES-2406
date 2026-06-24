import type { ChordEntry } from '@/data/chords/chord-schema';
import { getChordBySymbol } from '@/data/chords/chord-database';

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export interface Substitute {
  chord: ChordEntry;
  type: 'tritone' | 'relative' | 'extension' | 'modal';
  explanation: string;
}

export function findSubstitutes(chord: ChordEntry): Substitute[] {
  const subs: Substitute[] = [];
  const rootPc = chord.root.pitchClass;

  if (['7', '9', '13', '7b9', '7#9'].includes(chord.qualityId)) {
    const tritonePc = (rootPc + 6) % 12;
    const tritoneSub = getChordBySymbol(`${FLAT_NAMES[tritonePc]}7`);
    if (tritoneSub) {
      subs.push({
        chord: tritoneSub,
        type: 'tritone',
        explanation: 'Substituto trítono — compartilha a 3ª e 7ª, criando cromatismo.',
      });
    }
  }

  if (['maj', 'maj7', '6', 'maj9'].includes(chord.qualityId)) {
    const relPc = (rootPc + 9) % 12;
    const relMin = getChordBySymbol(`${SHARP_NAMES[relPc]}m7`) || getChordBySymbol(`${SHARP_NAMES[relPc]}m`);
    if (relMin) {
      subs.push({
        chord: relMin,
        type: 'relative',
        explanation: 'Relativo menor — compartilha 3 notas, sensação melancólica.',
      });
    }
  }

  if (['min', 'm7', 'm9'].includes(chord.qualityId)) {
    const relPc = (rootPc + 3) % 12;
    const relMaj = getChordBySymbol(`${FLAT_NAMES[relPc]}maj7`) || getChordBySymbol(`${FLAT_NAMES[relPc]}`);
    if (relMaj) {
      subs.push({
        chord: relMaj,
        type: 'relative',
        explanation: 'Relativo maior — compartilha 3 notas, sensação luminosa.',
      });
    }
  }

  const extMap: Record<string, string[]> = {
    'maj': ['maj7', '6'], 'min': ['m7'], '7': ['9', '13'], 'maj7': ['maj9'], 'm7': ['m9'],
  };
  for (const ext of extMap[chord.qualityId] || []) {
    const c = getChordBySymbol(`${chord.root.name}${ext}`);
    if (c) subs.push({ chord: c, type: 'extension', explanation: 'Versão estendida com mais cor harmônica.' });
  }

  return subs.slice(0, 6);
}
