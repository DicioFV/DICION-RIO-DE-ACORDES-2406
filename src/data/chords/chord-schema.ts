import type {
  Note,
  Interval,
  ChordCategory,
  ChordComplexity,
} from '@/lib/music-theory/types';

/**
 * ============================================================
 * TIPOS DO BANCO DE ACORDES
 * ============================================================
 */

/**
 * Nível de acesso para monetização futura
 */
export type AccessLevel = 'free' | 'pro' | 'master' | 'premium';

/**
 * Entrada completa de um acorde no banco
 */
export interface ChordEntry {
  // Identificação
  id: string; // "c-maj7" (kebab-case, único)
  slug: string; // "do-maior-setima" (SEO PT-BR)
  symbol: string; // "Cmaj7"
  symbolAlternatives: string[]; // ["CM7", "CΔ7"]

  // Estrutura musical
  root: Note;
  bass?: Note; // Para slash chords
  notes: Note[];
  intervals: Interval[];

  // Qualidade
  qualityId: string; // "maj7"
  qualityName: string; // "Sétima Maior"
  category: ChordCategory;
  complexity: ChordComplexity;

  // Metadados SEO/Conteúdo
  displayName: string; // "Dó Maior com Sétima Maior"
  shortDescription: string; // 1 linha
  longDescription?: string; // parágrafos

  // Harmonia
  commonKeys: string[]; // tonalidades onde aparece
  functions: string[]; // ['I', 'IV/G', etc.]
  enharmonicEquivalents: string[]; // IDs de acordes enarmônicos

  // Uso
  styles: string[]; // ['jazz', 'gospel', 'pop']
  usageExamples?: string[];

  // Relações
  relatedChordIds?: string[];
  substituteChordIds?: string[];

  // Flags
  isSlashChord: boolean;
  isPolychord: boolean;

  // Controle de acesso
  accessLevel: AccessLevel;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Estrutura do arquivo JSON do banco
 */
export interface ChordDatabaseFile {
  version: string;
  generatedAt: string;
  totalCount: number;
  stats: DatabaseStats;
  chords: ChordEntry[];
}

/**
 * Estatísticas do banco
 */
export interface DatabaseStats {
  total: number;
  byCategory: Record<string, number>;
  byComplexity: Record<string, number>;
  byAccessLevel: Record<string, number>;
  slashChords: number;
  polychords: number;
}

/**
 * Determina o nível de acesso baseado na complexidade
 */
export function determineAccessLevel(complexity: ChordComplexity): AccessLevel {
  switch (complexity) {
    case 'beginner':
      return 'free';
    case 'basic':
      return 'free';
    case 'intermediate':
      return 'pro';
    case 'advanced':
      return 'master';
    case 'master':
      return 'premium';
    default:
      return 'free';
  }
}

/**
 * Valida uma entrada de acorde
 */
export function validateChordEntry(entry: Partial<ChordEntry>): string[] {
  const errors: string[] = [];

  if (!entry.id) errors.push('ID é obrigatório');
  if (!entry.slug) errors.push('Slug é obrigatório');
  if (!entry.symbol) errors.push('Símbolo é obrigatório');
  if (!entry.root) errors.push('Nota raiz é obrigatória');
  if (!entry.notes || entry.notes.length === 0) errors.push('Notas são obrigatórias');
  if (!entry.qualityId) errors.push('QualityId é obrigatório');
  if (!entry.category) errors.push('Categoria é obrigatória');

  return errors;
}
