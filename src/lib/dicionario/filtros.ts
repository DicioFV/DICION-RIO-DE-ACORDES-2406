/**
 * ============================================================
 * SISTEMA DE FILTROS DO DICIONÁRIO
 * ============================================================
 */

export type CategoriaAcorde = 'triades' | 'tetrades' | 'extensoes' | 'alterados' | 'sus';
export type NivelComplexidade = 'iniciante' | 'basico' | 'intermediario' | 'avancado' | 'mestre';

export interface FiltrosAtivos {
  categorias: CategoriaAcorde[];
  complexidade: NivelComplexidade[];
  busca: string;
}

export const FILTROS_INICIAIS: FiltrosAtivos = {
  categorias: [],
  complexidade: [],
  busca: '',
};

export const CATEGORIAS_CONFIG: Record<CategoriaAcorde, {
  label: string; emoji: string; descricao: string; qualidades: string[];
}> = {
  triades: {
    label: 'Tríades', emoji: '🔺', descricao: 'Acordes de 3 notas',
    qualidades: ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', 'power'],
  },
  tetrades: {
    label: 'Tétrades', emoji: '🔷', descricao: 'Com sétima',
    qualidades: ['6', 'm6', '6/9', '7', 'm7', 'maj7', 'mMaj7', 'm7b5', 'dim7', 'aug7', 'augMaj7', '7sus4'],
  },
  extensoes: {
    label: 'Extensões', emoji: '🔶', descricao: 'Com 9ª, 11ª, 13ª',
    qualidades: ['9', 'm9', 'maj9', 'add9', 'madd9', '11', 'm11', 'maj11', 'add11', '13', 'm13', 'maj13'],
  },
  alterados: {
    label: 'Alterados', emoji: '⚡', descricao: 'Tensões alteradas',
    qualidades: ['7b5', '7#5', '7b9', '7#9', '7#11', '7b13', '7alt', '9b5', '13b9', '13#11'],
  },
  sus: {
    label: 'Sus & Add', emoji: '🎯', descricao: 'Suspensos e adicionados',
    qualidades: ['sus2', 'sus4', '7sus4', 'add9', 'add11', 'madd9'],
  },
};

export const COMPLEXIDADE_CONFIG: Record<NivelComplexidade, {
  label: string; emoji: string; cor: string;
}> = {
  iniciante: { label: 'Iniciante', emoji: '🌱', cor: 'text-emerald-500' },
  basico: { label: 'Básico', emoji: '⭐', cor: 'text-blue-500' },
  intermediario: { label: 'Intermediário', emoji: '🔥', cor: 'text-amber-500' },
  avancado: { label: 'Avançado', emoji: '💎', cor: 'text-purple-500' },
  mestre: { label: 'Mestre', emoji: '👑', cor: 'text-rose-500' },
};

export function getComplexidadeFromChordComplexity(c: string): NivelComplexidade {
  const map: Record<string, NivelComplexidade> = {
    'beginner': 'iniciante', 'basic': 'basico', 'intermediate': 'intermediario',
    'advanced': 'avancado', 'master': 'mestre',
  };
  return map[c] || 'intermediario';
}

export function getCategoriaFromChordCategory(c: string): CategoriaAcorde {
  const map: Record<string, CategoriaAcorde> = {
    'triad': 'triades', 'seventh': 'tetrades', 'extended': 'extensoes',
    'altered': 'alterados', 'suspended': 'sus', 'added': 'sus',
    'sixth': 'tetrades', 'diminished': 'triades', 'augmented': 'triades',
    'power': 'triades', 'slash': 'tetrades', 'polychord': 'extensoes',
  };
  return map[c] || 'triades';
}
