import type { FretboardInstrument } from './fretboard-types';

/**
 * ============================================================
 * ESPECIFICAÇÕES VISUAIS E TÉCNICAS POR INSTRUMENTO
 * ============================================================
 */

export interface InstrumentSpec {
  id: FretboardInstrument;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
  stringCount: number;
  isPaired?: boolean;
  pairCount?: number;
  stringSpacing: number;
  fretWidth: number;
  fretCount: number;
  diagramFretsVisible: number;
  woodColor: string;
  stringColor: string;
  inlayStyle: 'dots' | 'diamonds' | 'none';
  typicalRange: { lowestMidi: number; highestMidi: number };
  commonStyles: string[];
}

export const INSTRUMENT_SPECS: Record<FretboardInstrument, InstrumentSpec> = {
  'guitar-nylon': {
    id: 'guitar-nylon',
    name: 'Violão Nylon',
    shortName: 'Violão',
    emoji: '🎸',
    description: 'Violão clássico/popular com cordas de nylon.',
    stringCount: 6,
    stringSpacing: 28,
    fretWidth: 60,
    fretCount: 19,
    diagramFretsVisible: 5,
    woodColor: '#3d2b1f',
    stringColor: '#e8dcc8',
    inlayStyle: 'dots',
    typicalRange: { lowestMidi: 40, highestMidi: 88 },
    commonStyles: ['mpb', 'bossa-nova', 'clássica', 'folk', 'sertanejo'],
  },
  'guitar-steel': {
    id: 'guitar-steel',
    name: 'Violão Aço',
    shortName: 'Folk',
    emoji: '🪕',
    description: 'Violão folk com cordas de aço, som mais brilhante.',
    stringCount: 6,
    stringSpacing: 28,
    fretWidth: 60,
    fretCount: 20,
    diagramFretsVisible: 5,
    woodColor: '#4a3728',
    stringColor: '#eee8e0',
    inlayStyle: 'dots',
    typicalRange: { lowestMidi: 40, highestMidi: 88 },
    commonStyles: ['country', 'folk', 'pop', 'gospel', 'worship'],
  },
  'guitar-electric': {
    id: 'guitar-electric',
    name: 'Guitarra Elétrica',
    shortName: 'Guitarra',
    emoji: '⚡',
    description: 'Guitarra elétrica com cordas de aço amplificadas.',
    stringCount: 6,
    stringSpacing: 26,
    fretWidth: 58,
    fretCount: 22,
    diagramFretsVisible: 5,
    woodColor: '#252525',
    stringColor: '#f0ece4',
    inlayStyle: 'dots',
    typicalRange: { lowestMidi: 40, highestMidi: 92 },
    commonStyles: ['rock', 'blues', 'jazz', 'metal', 'funk'],
  },
  'ukulele': {
    id: 'ukulele',
    name: 'Ukulele',
    shortName: 'Ukulele',
    emoji: '🌺',
    description: 'Pequeno instrumento havaiano de 4 cordas. Som doce e alegre.',
    stringCount: 4,
    stringSpacing: 32,
    fretWidth: 48,
    fretCount: 15,
    diagramFretsVisible: 4,
    woodColor: '#5a4230',
    stringColor: '#f0e8d8',
    inlayStyle: 'dots',
    typicalRange: { lowestMidi: 60, highestMidi: 88 },
    commonStyles: ['hawaiano', 'pop', 'folk', 'indie'],
  },
  'cavaquinho': {
    id: 'cavaquinho',
    name: 'Cavaquinho',
    shortName: 'Cavaco',
    emoji: '🎵',
    description: 'Instrumento de 4 cordas, alma do samba e do choro brasileiros.',
    stringCount: 4,
    stringSpacing: 30,
    fretWidth: 44,
    fretCount: 17,
    diagramFretsVisible: 4,
    woodColor: '#4d3520',
    stringColor: '#ece0cc',
    inlayStyle: 'dots',
    typicalRange: { lowestMidi: 62, highestMidi: 86 },
    commonStyles: ['samba', 'choro', 'pagode', 'mpb'],
  },
  'mandolin': {
    id: 'mandolin',
    name: 'Bandolim',
    shortName: 'Bandolim',
    emoji: '🎻',
    description: 'Instrumento de 8 cordas em 4 pares duplos. Som agudo e cristalino.',
    stringCount: 4,
    isPaired: true,
    pairCount: 4,
    stringSpacing: 28,
    fretWidth: 38,
    fretCount: 17,
    diagramFretsVisible: 5,
    woodColor: '#3a2818',
    stringColor: '#f0ece4',
    inlayStyle: 'diamonds',
    typicalRange: { lowestMidi: 55, highestMidi: 89 },
    commonStyles: ['choro', 'bluegrass', 'erudita', 'celta'],
  },
};

export function getInstrumentSpec(id: FretboardInstrument): InstrumentSpec {
  return INSTRUMENT_SPECS[id];
}

export function getAllInstruments(): InstrumentSpec[] {
  return Object.values(INSTRUMENT_SPECS);
}

export function getInstrumentsByCategory(): Record<string, InstrumentSpec[]> {
  return {
    'Violão & Guitarra': [
      INSTRUMENT_SPECS['guitar-nylon'],
      INSTRUMENT_SPECS['guitar-steel'],
      INSTRUMENT_SPECS['guitar-electric'],
    ],
    'Pequenas Cordas': [
      INSTRUMENT_SPECS['ukulele'],
      INSTRUMENT_SPECS['cavaquinho'],
      INSTRUMENT_SPECS['mandolin'],
    ],
  };
}
