import type { ChordQuality } from '../types';

/**
 * ============================================================
 * BIBLIOTECA DE QUALIDADES DE ACORDES
 * 40+ qualidades cobrindo do básico ao avançado
 * ============================================================
 */

export const CHORD_QUALITIES: ChordQuality[] = [
  // ============ TRÍADES ============
  {
    id: 'maj',
    symbol: '',
    fullName: 'Maior',
    aliases: ['M', 'Major', 'Δ'],
    intervals: ['P1', 'M3', 'P5'],
    category: 'triad',
    complexity: 'beginner',
  },
  {
    id: 'min',
    symbol: 'm',
    fullName: 'Menor',
    aliases: ['min', '-'],
    intervals: ['P1', 'm3', 'P5'],
    category: 'triad',
    complexity: 'beginner',
  },
  {
    id: 'dim',
    symbol: 'dim',
    fullName: 'Diminuto',
    aliases: ['°', 'o'],
    intervals: ['P1', 'm3', 'd5'],
    category: 'diminished',
    complexity: 'basic',
  },
  {
    id: 'aug',
    symbol: 'aug',
    fullName: 'Aumentado',
    aliases: ['+', '#5'],
    intervals: ['P1', 'M3', 'A5'],
    category: 'augmented',
    complexity: 'basic',
  },

  // ============ SUSPENSOS ============
  {
    id: 'sus2',
    symbol: 'sus2',
    fullName: 'Suspenso Segunda',
    aliases: ['2'],
    intervals: ['P1', 'M2', 'P5'],
    category: 'suspended',
    complexity: 'basic',
  },
  {
    id: 'sus4',
    symbol: 'sus4',
    fullName: 'Suspenso Quarta',
    aliases: ['sus', '4'],
    intervals: ['P1', 'P4', 'P5'],
    category: 'suspended',
    complexity: 'basic',
  },

  // ============ POWER CHORD ============
  {
    id: 'power',
    symbol: '5',
    fullName: 'Power Chord',
    aliases: ['5', 'no3'],
    intervals: ['P1', 'P5'],
    category: 'power',
    complexity: 'beginner',
  },

  // ============ SEXTAS ============
  {
    id: '6',
    symbol: '6',
    fullName: 'Sexta Maior',
    aliases: ['maj6', 'M6'],
    intervals: ['P1', 'M3', 'P5', 'M6'],
    category: 'sixth',
    complexity: 'basic',
  },
  {
    id: 'm6',
    symbol: 'm6',
    fullName: 'Menor com Sexta',
    aliases: ['min6', '-6'],
    intervals: ['P1', 'm3', 'P5', 'M6'],
    category: 'sixth',
    complexity: 'intermediate',
  },
  {
    id: '6/9',
    symbol: '6/9',
    fullName: 'Sexta Nona',
    aliases: ['6add9'],
    intervals: ['P1', 'M3', 'P5', 'M6', 'M9'],
    category: 'sixth',
    complexity: 'intermediate',
  },

  // ============ SÉTIMAS (TÉTRADES) ============
  {
    id: '7',
    symbol: '7',
    fullName: 'Sétima Dominante',
    aliases: ['dom7'],
    intervals: ['P1', 'M3', 'P5', 'm7'],
    category: 'seventh',
    complexity: 'basic',
  },
  {
    id: 'maj7',
    symbol: 'maj7',
    fullName: 'Sétima Maior',
    aliases: ['M7', 'Δ7', 'Maj7'],
    intervals: ['P1', 'M3', 'P5', 'M7'],
    category: 'seventh',
    complexity: 'basic',
  },
  {
    id: 'm7',
    symbol: 'm7',
    fullName: 'Menor com Sétima',
    aliases: ['min7', '-7'],
    intervals: ['P1', 'm3', 'P5', 'm7'],
    category: 'seventh',
    complexity: 'basic',
  },
  {
    id: 'mMaj7',
    symbol: 'mMaj7',
    fullName: 'Menor com Sétima Maior',
    aliases: ['m(Maj7)', 'mΔ7', 'minMaj7'],
    intervals: ['P1', 'm3', 'P5', 'M7'],
    category: 'seventh',
    complexity: 'advanced',
  },
  {
    id: 'm7b5',
    symbol: 'm7b5',
    fullName: 'Meio Diminuto',
    aliases: ['ø', 'ø7', 'half-dim'],
    intervals: ['P1', 'm3', 'd5', 'm7'],
    category: 'seventh',
    complexity: 'intermediate',
  },
  {
    id: 'dim7',
    symbol: 'dim7',
    fullName: 'Diminuto com Sétima',
    aliases: ['°7', 'o7'],
    intervals: ['P1', 'm3', 'd5', 'd7'],
    category: 'diminished',
    complexity: 'intermediate',
  },
  {
    id: 'aug7',
    symbol: 'aug7',
    fullName: 'Aumentado com Sétima',
    aliases: ['+7', '7#5'],
    intervals: ['P1', 'M3', 'A5', 'm7'],
    category: 'augmented',
    complexity: 'advanced',
  },
  {
    id: 'augMaj7',
    symbol: 'augMaj7',
    fullName: 'Aumentado com Sétima Maior',
    aliases: ['+Maj7', 'maj7#5'],
    intervals: ['P1', 'M3', 'A5', 'M7'],
    category: 'augmented',
    complexity: 'advanced',
  },
  {
    id: '7sus4',
    symbol: '7sus4',
    fullName: 'Sétima Suspensa',
    aliases: ['7sus'],
    intervals: ['P1', 'P4', 'P5', 'm7'],
    category: 'suspended',
    complexity: 'intermediate',
  },

  // ============ ADD ============
  {
    id: 'add9',
    symbol: 'add9',
    fullName: 'Add 9',
    aliases: ['add2'],
    intervals: ['P1', 'M3', 'P5', 'M9'],
    category: 'added',
    complexity: 'basic',
  },
  {
    id: 'madd9',
    symbol: 'm(add9)',
    fullName: 'Menor add 9',
    aliases: ['madd9'],
    intervals: ['P1', 'm3', 'P5', 'M9'],
    category: 'added',
    complexity: 'intermediate',
  },
  {
    id: 'add11',
    symbol: 'add11',
    fullName: 'Add 11',
    aliases: [],
    intervals: ['P1', 'M3', 'P5', 'P11'],
    category: 'added',
    complexity: 'intermediate',
  },

  // ============ NONAS ============
  {
    id: '9',
    symbol: '9',
    fullName: 'Nona Dominante',
    aliases: ['dom9'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9'],
    category: 'extended',
    complexity: 'intermediate',
  },
  {
    id: 'maj9',
    symbol: 'maj9',
    fullName: 'Nona Maior',
    aliases: ['M9', 'Δ9'],
    intervals: ['P1', 'M3', 'P5', 'M7', 'M9'],
    category: 'extended',
    complexity: 'intermediate',
  },
  {
    id: 'm9',
    symbol: 'm9',
    fullName: 'Menor Nona',
    aliases: ['min9', '-9'],
    intervals: ['P1', 'm3', 'P5', 'm7', 'M9'],
    category: 'extended',
    complexity: 'intermediate',
  },

  // ============ DÉCIMA-PRIMEIRAS ============
  {
    id: '11',
    symbol: '11',
    fullName: 'Décima-Primeira Dominante',
    aliases: [],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9', 'P11'],
    category: 'extended',
    complexity: 'advanced',
  },
  {
    id: 'maj11',
    symbol: 'maj11',
    fullName: 'Décima-Primeira Maior',
    aliases: ['M11', 'Δ11'],
    intervals: ['P1', 'M3', 'P5', 'M7', 'M9', 'P11'],
    category: 'extended',
    complexity: 'advanced',
  },
  {
    id: 'm11',
    symbol: 'm11',
    fullName: 'Menor Décima-Primeira',
    aliases: ['min11', '-11'],
    intervals: ['P1', 'm3', 'P5', 'm7', 'M9', 'P11'],
    category: 'extended',
    complexity: 'advanced',
  },

  // ============ TRÉDECIMAS ============
  {
    id: '13',
    symbol: '13',
    fullName: 'Décima-Terceira Dominante',
    aliases: [],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
    category: 'extended',
    complexity: 'advanced',
  },
  {
    id: 'maj13',
    symbol: 'maj13',
    fullName: 'Décima-Terceira Maior',
    aliases: ['M13', 'Δ13'],
    intervals: ['P1', 'M3', 'P5', 'M7', 'M9', 'P11', 'M13'],
    category: 'extended',
    complexity: 'advanced',
  },
  {
    id: 'm13',
    symbol: 'm13',
    fullName: 'Menor Décima-Terceira',
    aliases: ['min13', '-13'],
    intervals: ['P1', 'm3', 'P5', 'm7', 'M9', 'P11', 'M13'],
    category: 'extended',
    complexity: 'advanced',
  },

  // ============ DOMINANTES ALTERADOS ============
  {
    id: '7b5',
    symbol: '7b5',
    fullName: 'Sétima com Quinta Bemol',
    aliases: ['7(b5)'],
    intervals: ['P1', 'M3', 'd5', 'm7'],
    category: 'altered',
    complexity: 'advanced',
  },
  {
    id: '7#5',
    symbol: '7#5',
    fullName: 'Sétima com Quinta Sustenida',
    aliases: ['7(#5)', '+7'],
    intervals: ['P1', 'M3', 'A5', 'm7'],
    category: 'altered',
    complexity: 'advanced',
  },
  {
    id: '7b9',
    symbol: '7b9',
    fullName: 'Sétima com Nona Bemol',
    aliases: ['7(b9)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'm9'],
    category: 'altered',
    complexity: 'advanced',
  },
  {
    id: '7#9',
    symbol: '7#9',
    fullName: 'Sétima com Nona Sustenida (Hendrix)',
    aliases: ['7(#9)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'A9'],
    category: 'altered',
    complexity: 'advanced',
  },
  {
    id: '7#11',
    symbol: '7#11',
    fullName: 'Sétima com Décima-Primeira Sustenida',
    aliases: ['7(#11)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9', 'A11'],
    category: 'altered',
    complexity: 'master',
  },
  {
    id: '7b13',
    symbol: '7b13',
    fullName: 'Sétima com Décima-Terceira Bemol',
    aliases: ['7(b13)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9', 'm13'],
    category: 'altered',
    complexity: 'master',
  },
  {
    id: '7alt',
    symbol: '7alt',
    fullName: 'Dominante Alterado',
    aliases: ['7(alt)'],
    intervals: ['P1', 'M3', 'A5', 'm7', 'm9', 'A9'],
    category: 'altered',
    complexity: 'master',
  },
  {
    id: '9b5',
    symbol: '9b5',
    fullName: 'Nona com Quinta Bemol',
    aliases: ['9(b5)'],
    intervals: ['P1', 'M3', 'd5', 'm7', 'M9'],
    category: 'altered',
    complexity: 'master',
  },
  {
    id: '13b9',
    symbol: '13b9',
    fullName: 'Décima-Terceira com Nona Bemol',
    aliases: ['13(b9)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'm9', 'M13'],
    category: 'altered',
    complexity: 'master',
  },
  {
    id: '13#11',
    symbol: '13#11',
    fullName: 'Décima-Terceira com Décima-Primeira Sustenida',
    aliases: ['13(#11)'],
    intervals: ['P1', 'M3', 'P5', 'm7', 'M9', 'A11', 'M13'],
    category: 'altered',
    complexity: 'master',
  },
];

/**
 * Mapas para busca rápida
 */
export const QUALITY_BY_ID = new Map(CHORD_QUALITIES.map((q) => [q.id, q]));
export const QUALITY_BY_SYMBOL = new Map(CHORD_QUALITIES.map((q) => [q.symbol, q]));

/**
 * Busca qualidade por símbolo OU por alias
 */
export function findQuality(input: string): ChordQuality | null {
  const exact = QUALITY_BY_SYMBOL.get(input);
  if (exact) return exact;

  for (const q of CHORD_QUALITIES) {
    if (q.aliases.includes(input)) return q;
  }

  return null;
}

/**
 * Busca qualidade por ID
 */
export function findQualityById(id: string): ChordQuality | null {
  return QUALITY_BY_ID.get(id) || null;
}

/**
 * Total de qualidades cadastradas
 */
export function getQualityCount(): number {
  return CHORD_QUALITIES.length;
}

/**
 * Filtra qualidades por categoria
 */
export function getQualitiesByCategory(category: string): ChordQuality[] {
  return CHORD_QUALITIES.filter((q) => q.category === category);
}

/**
 * Filtra qualidades por nível de complexidade
 */
export function getQualitiesByComplexity(complexity: string): ChordQuality[] {
  return CHORD_QUALITIES.filter((q) => q.complexity === complexity);
}

/**
 * Retorna todas as categorias disponíveis
 */
export function getAllCategories(): string[] {
  return [...new Set(CHORD_QUALITIES.map((q) => q.category))];
}

/**
 * Retorna todos os níveis de complexidade
 */
export function getAllComplexities(): string[] {
  return ['beginner', 'basic', 'intermediate', 'advanced', 'master'];
}
