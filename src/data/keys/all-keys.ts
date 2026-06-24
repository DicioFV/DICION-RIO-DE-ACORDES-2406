/**
 * As 12 tonalidades cromáticas + variações enarmônicas comuns
 */

export interface KeyInfo {
  name: string; // "C", "F#", "Db"
  displayName: string; // "Dó", "Fá Sustenido", "Ré Bemol"
  slug: string; // "do", "fa-sustenido", "re-bemol"
  preferFlats: boolean;
}

export const ALL_KEYS: KeyInfo[] = [
  { name: 'C', displayName: 'Dó', slug: 'do', preferFlats: false },
  { name: 'C#', displayName: 'Dó Sustenido', slug: 'do-sustenido', preferFlats: false },
  { name: 'Db', displayName: 'Ré Bemol', slug: 're-bemol', preferFlats: true },
  { name: 'D', displayName: 'Ré', slug: 're', preferFlats: false },
  { name: 'D#', displayName: 'Ré Sustenido', slug: 're-sustenido', preferFlats: false },
  { name: 'Eb', displayName: 'Mi Bemol', slug: 'mi-bemol', preferFlats: true },
  { name: 'E', displayName: 'Mi', slug: 'mi', preferFlats: false },
  { name: 'F', displayName: 'Fá', slug: 'fa', preferFlats: true },
  { name: 'F#', displayName: 'Fá Sustenido', slug: 'fa-sustenido', preferFlats: false },
  { name: 'Gb', displayName: 'Sol Bemol', slug: 'sol-bemol', preferFlats: true },
  { name: 'G', displayName: 'Sol', slug: 'sol', preferFlats: false },
  { name: 'G#', displayName: 'Sol Sustenido', slug: 'sol-sustenido', preferFlats: false },
  { name: 'Ab', displayName: 'Lá Bemol', slug: 'la-bemol', preferFlats: true },
  { name: 'A', displayName: 'Lá', slug: 'la', preferFlats: false },
  { name: 'A#', displayName: 'Lá Sustenido', slug: 'la-sustenido', preferFlats: false },
  { name: 'Bb', displayName: 'Si Bemol', slug: 'si-bemol', preferFlats: true },
  { name: 'B', displayName: 'Si', slug: 'si', preferFlats: false },
];

/**
 * 12 raízes cromáticas principais (para gerar acordes)
 * Usa preferencialmente sustenidos para evitar duplicação excessiva
 */
export const PRIMARY_ROOTS: KeyInfo[] = [
  ALL_KEYS[0],  // C
  ALL_KEYS[1],  // C#
  ALL_KEYS[3],  // D
  ALL_KEYS[5],  // Eb
  ALL_KEYS[6],  // E
  ALL_KEYS[7],  // F
  ALL_KEYS[8],  // F#
  ALL_KEYS[10], // G
  ALL_KEYS[12], // Ab
  ALL_KEYS[13], // A
  ALL_KEYS[15], // Bb
  ALL_KEYS[16], // B
];

/**
 * Todas as raízes cromáticas (incluindo enarmônicos)
 * Para gerar o banco completo com ambas notações
 */
export const CHORD_ROOTS = ALL_KEYS;

/**
 * Tonalidades preferidas para análise harmônica diatônica
 * Remove duplicatas enarmônicas raras
 */
export const DIATONIC_KEYS = ALL_KEYS.filter(
  (k) => !['C#', 'D#', 'G#', 'A#'].includes(k.name)
);

/**
 * Encontra informações de uma tonalidade pelo nome
 */
export function getKeyInfo(name: string): KeyInfo | undefined {
  return ALL_KEYS.find((k) => k.name === name);
}

/**
 * Retorna o nome de exibição em português para uma nota
 */
export function getNoteDisplayName(noteName: string): string {
  const key = getKeyInfo(noteName);
  return key?.displayName || noteName;
}
