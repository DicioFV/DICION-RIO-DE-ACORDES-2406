// Notas musicais
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

// Qualidades de acordes (placeholder — expandido no Bloco 02)
export const CHORD_QUALITIES = [
  { symbol: '', name: 'Maior', formula: '1 3 5' },
  { symbol: 'm', name: 'Menor', formula: '1 b3 5' },
  { symbol: '7', name: 'Dominante 7', formula: '1 3 5 b7' },
  { symbol: 'maj7', name: 'Maior 7', formula: '1 3 5 7' },
  { symbol: 'm7', name: 'Menor 7', formula: '1 b3 5 b7' },
  { symbol: 'dim', name: 'Diminuto', formula: '1 b3 b5' },
  { symbol: 'aug', name: 'Aumentado', formula: '1 3 #5' },
  { symbol: 'sus4', name: 'Suspenso 4', formula: '1 4 5' },
  { symbol: 'sus2', name: 'Suspenso 2', formula: '1 2 5' },
  { symbol: '9', name: 'Nona', formula: '1 3 5 b7 9' },
] as const;

// Cores por nota (para visualizações futuras)
export const NOTE_COLORS: Record<string, string> = {
  'C': '#ef4444',
  'C#': '#f97316',
  'D': '#f59e0b',
  'D#': '#eab308',
  'E': '#84cc16',
  'F': '#22c55e',
  'F#': '#14b8a6',
  'G': '#06b6d4',
  'G#': '#3b82f6',
  'A': '#6366f1',
  'A#': '#8b5cf6',
  'B': '#a855f7',
};
