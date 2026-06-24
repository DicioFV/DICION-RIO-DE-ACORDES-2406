/**
 * ============================================================
 * MOTOR DE LAYOUT SVG DO PIANO
 *
 * Calcula posições, dimensões e escalas das teclas.
 * ============================================================
 */

// Padrão de teclas pretas dentro de uma oitava (C=0)
// 0:C, 1:C#, 2:D, 3:D#, 4:E, 5:F, 6:F#, 7:G, 8:G#, 9:A, 10:A#, 11:B
const BLACK_KEY_PATTERN = [
  false, true, false, true, false, false, true, false, true, false, true, false,
];

/**
 * Verifica se uma tecla MIDI é preta
 */
export function isBlackKey(midi: number): boolean {
  return BLACK_KEY_PATTERN[((midi % 12) + 12) % 12];
}

/**
 * Dimensões padrão (em unidades SVG — escala com viewBox)
 */
export const PIANO_DIMENSIONS = {
  whiteKeyWidth: 24,
  whiteKeyHeight: 140,
  blackKeyWidth: 14,
  blackKeyHeight: 88,
  whiteKeyGap: 1,
};

/**
 * Conta quantas teclas BRANCAS existem entre dois MIDIs (inclusive)
 */
export function countWhiteKeys(startMidi: number, endMidi: number): number {
  let count = 0;
  for (let m = startMidi; m <= endMidi; m++) {
    if (!isBlackKey(m)) count++;
  }
  return count;
}

/**
 * Calcula a posição X de uma tecla específica no SVG
 */
export function getKeyX(midi: number, startMidi: number): number {
  const { whiteKeyWidth, whiteKeyGap, blackKeyWidth } = PIANO_DIMENSIONS;
  const totalWhiteWidth = whiteKeyWidth + whiteKeyGap;

  if (!isBlackKey(midi)) {
    // Tecla branca: posição linear baseada em quantas brancas vieram antes
    const whitesBefore = countWhiteKeys(startMidi, midi - 1);
    return whitesBefore * totalWhiteWidth;
  } else {
    // Tecla preta: posicionada entre duas brancas
    // Pega posição da branca anterior + offset
    const prevWhiteMidi = midi - 1;
    const whitesBefore = countWhiteKeys(startMidi, prevWhiteMidi);
    const prevWhiteX = whitesBefore > 0 ? (whitesBefore - 1) * totalWhiteWidth : 0;
    return prevWhiteX + whiteKeyWidth - blackKeyWidth / 2 + whiteKeyGap;
  }
}

/**
 * Largura total do SVG para um range
 */
export function getTotalWidth(startMidi: number, endMidi: number): number {
  const whites = countWhiteKeys(startMidi, endMidi);
  return whites * (PIANO_DIMENSIONS.whiteKeyWidth + PIANO_DIMENSIONS.whiteKeyGap);
}

/**
 * Ranges pré-definidos
 */
export const PIANO_RANGES = {
  'full-88': { start: 21, end: 108 }, // A0 a C8
  'compact-49': { start: 36, end: 84 }, // C2 a C6
  'compact-25': { start: 48, end: 72 }, // C3 a C5
  'chord-focus': { start: 48, end: 84 }, // C3 a C6 (foco em acordes)
} as const;

/**
 * Calcula range dinâmico com base nas notas do acorde
 * (garante que todas as notas caibam + margem)
 */
export function getChordFocusRange(activeMidis: number[]): {
  start: number;
  end: number;
} {
  if (activeMidis.length === 0) return PIANO_RANGES['chord-focus'];

  const min = Math.min(...activeMidis);
  const max = Math.max(...activeMidis);

  // Adiciona margem e arredonda para oitavas
  const start = Math.max(21, Math.floor((min - 6) / 12) * 12);
  const end = Math.min(108, Math.ceil((max + 6) / 12) * 12 + 11);

  return { start, end };
}

/**
 * Retorna o nome da nota para um MIDI
 */
export function midiToNoteName(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return names[midi % 12];
}

/**
 * Retorna a oitava para um MIDI
 */
export function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}
