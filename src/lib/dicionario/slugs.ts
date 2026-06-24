/**
 * ============================================================
 * SISTEMA DE SLUGS E URLs AMIGÁVEIS
 * ============================================================
 */

export const TONALIDADES_SLUGS: Record<string, string> = {
  'C': 'do', 'C#': 'do-sustenido', 'Db': 're-bemol',
  'D': 're', 'D#': 're-sustenido', 'Eb': 'mi-bemol',
  'E': 'mi', 'F': 'fa', 'F#': 'fa-sustenido',
  'Gb': 'sol-bemol', 'G': 'sol', 'G#': 'sol-sustenido',
  'Ab': 'la-bemol', 'A': 'la', 'A#': 'la-sustenido',
  'Bb': 'si-bemol', 'B': 'si',
};

export const SLUGS_TONALIDADES: Record<string, string> = Object.fromEntries(
  Object.entries(TONALIDADES_SLUGS).map(([k, v]) => [v, k])
);

export const NOTAS_DISPLAY: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb', 'D': 'Ré', 'D#': 'Ré#',
  'Eb': 'Mib', 'E': 'Mi', 'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb',
  'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Láb', 'A': 'Lá', 'A#': 'Lá#',
  'Bb': 'Sib', 'B': 'Si',
};

export const NOTAS_NATURAIS = [
  { nota: 'C', nome: 'Dó', slug: 'do' },
  { nota: 'D', nome: 'Ré', slug: 're' },
  { nota: 'E', nome: 'Mi', slug: 'mi' },
  { nota: 'F', nome: 'Fá', slug: 'fa' },
  { nota: 'G', nome: 'Sol', slug: 'sol' },
  { nota: 'A', nome: 'Lá', slug: 'la' },
  { nota: 'B', nome: 'Si', slug: 'si' },
];

export const NOTAS_ALTERADAS = [
  { nota: 'Db', nome: 'Réb', slug: 're-bemol' },
  { nota: 'Eb', nome: 'Mib', slug: 'mi-bemol' },
  { nota: 'F#', nome: 'Fá#', slug: 'fa-sustenido' },
  { nota: 'Ab', nome: 'Láb', slug: 'la-bemol' },
  { nota: 'Bb', nome: 'Sib', slug: 'si-bemol' },
];

export const TODAS_NOTAS_CROMATICAS = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];
