import type { Tuning, FretboardInstrument } from './fretboard-types';

/**
 * ============================================================
 * BIBLIOTECA DE AFINAÇÕES
 *
 * Cada afinação lista cordas da MAIS GRAVE à MAIS AGUDA
 * ============================================================
 */

export const GUITAR_TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Padrão (E A D G B E)',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    description: 'Afinação universal do violão e guitarra.',
  },
  {
    id: 'drop-d',
    name: 'Drop D (D A D G B E)',
    notes: ['D', 'A', 'D', 'G', 'B', 'E'],
    description: '6ª corda baixada um tom. Comum em rock e metal.',
  },
  {
    id: 'open-g',
    name: 'Open G (D G D G B D)',
    notes: ['D', 'G', 'D', 'G', 'B', 'D'],
    description: 'Cordas soltas formam acorde de Sol maior. Blues e slide.',
  },
  {
    id: 'open-d',
    name: 'Open D (D A D F# A D)',
    notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
    description: 'Cordas soltas formam acorde de Ré maior.',
  },
  {
    id: 'dadgad',
    name: 'DADGAD (D A D G A D)',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
    description: 'Afinação modal celta. Som suspenso e sonoro.',
  },
  {
    id: 'half-step-down',
    name: 'Meio Tom Abaixo (Eb Ab Db Gb Bb Eb)',
    notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
    description: 'Tudo meio tom abaixo. Hendrix, SRV, Slash.',
  },
];

export const UKULELE_TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Padrão (G C E A)',
    notes: ['G', 'C', 'E', 'A'],
    description: 'Afinação padrão do ukulele soprano e concert.',
  },
  {
    id: 'baritone',
    name: 'Barítono (D G B E)',
    notes: ['D', 'G', 'B', 'E'],
    description: 'Ukulele barítono — igual às 4 cordas agudas do violão.',
  },
];

export const CAVAQUINHO_TUNINGS: Tuning[] = [
  {
    id: 'standard-br',
    name: 'Padrão Brasileiro (D G B D)',
    notes: ['D', 'G', 'B', 'D'],
    description: 'Afinação padrão do cavaquinho no Brasil (samba, choro).',
  },
  {
    id: 'standard-pt',
    name: 'Padrão Português (C G A D)',
    notes: ['C', 'G', 'A', 'D'],
    description: 'Afinação do cavaquinho lisboeta.',
  },
];

export const MANDOLIN_TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Padrão (G D A E)',
    notes: ['G', 'D', 'A', 'E'],
    description: 'Afinação padrão do bandolim (igual ao violino).',
  },
];

/**
 * Retorna afinações de acordo com o instrumento
 */
export function getTuningsForInstrument(instrument: FretboardInstrument): Tuning[] {
  switch (instrument) {
    case 'guitar-nylon':
    case 'guitar-steel':
    case 'guitar-electric':
      return GUITAR_TUNINGS;
    case 'ukulele':
      return UKULELE_TUNINGS;
    case 'cavaquinho':
      return CAVAQUINHO_TUNINGS;
    case 'mandolin':
      return MANDOLIN_TUNINGS;
    default:
      return GUITAR_TUNINGS;
  }
}

/**
 * Número de cordas por instrumento
 */
export function getStringCount(instrument: FretboardInstrument): number {
  switch (instrument) {
    case 'guitar-nylon':
    case 'guitar-steel':
    case 'guitar-electric':
      return 6;
    case 'ukulele':
    case 'cavaquinho':
    case 'mandolin':
      return 4;
    default:
      return 6;
  }
}
