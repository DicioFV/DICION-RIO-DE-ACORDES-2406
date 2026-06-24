export type InstrumentId =
  | 'piano'
  | 'guitar'
  | 'electric-guitar'
  | 'ukulele'
  | 'cavaquinho'
  | 'mandolin';

export interface InstrumentMeta {
  id: InstrumentId;
  name: string;
  slug: string;
  icon: string;
  strings?: number;
  defaultTuning?: string[];
  enabled: boolean;
}

export const INSTRUMENTS: InstrumentMeta[] = [
  {
    id: 'piano',
    name: 'Piano / Teclado',
    slug: 'piano',
    icon: '🎹',
    enabled: true,
  },
  {
    id: 'guitar',
    name: 'Violão',
    slug: 'violao',
    icon: '🎸',
    strings: 6,
    defaultTuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    enabled: true,
  },
  {
    id: 'electric-guitar',
    name: 'Guitarra',
    slug: 'guitarra',
    icon: '🎸',
    strings: 6,
    defaultTuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    enabled: true,
  },
  {
    id: 'ukulele',
    name: 'Ukulele',
    slug: 'ukulele',
    icon: '🪕',
    strings: 4,
    defaultTuning: ['G', 'C', 'E', 'A'],
    enabled: true,
  },
  {
    id: 'cavaquinho',
    name: 'Cavaquinho',
    slug: 'cavaquinho',
    icon: '🪕',
    strings: 4,
    defaultTuning: ['D', 'G', 'B', 'D'],
    enabled: true,
  },
  {
    id: 'mandolin',
    name: 'Bandolim',
    slug: 'bandolim',
    icon: '🎻',
    strings: 8,
    defaultTuning: ['G', 'D', 'A', 'E'],
    enabled: true,
  },
];
