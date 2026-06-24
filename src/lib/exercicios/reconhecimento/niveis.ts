/**
 * ============================================================
 * 5 NÍVEIS DE RECONHECIMENTO VISUAL
 * ============================================================
 */

export interface NivelReconhecimento {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string;
  emoji: string;
  cor: string;
  qualidades: string[];
  tonalidades: string[];
  questoesPorSessao: number;
  xpPorQuestao: number;
  dicasGerais: string[];
}

export const NIVEIS_RECONHECIMENTO: NivelReconhecimento[] = [
  {
    id: 'iniciante', numero: 1, nome: 'Iniciante', subtitulo: 'Tríades Maiores e Menores',
    emoji: '🌱', cor: 'from-emerald-500 to-green-600',
    qualidades: ['', 'm'], tonalidades: ['C', 'G', 'F', 'D', 'A', 'E'],
    questoesPorSessao: 10, xpPorQuestao: 10,
    dicasGerais: ['Maior: 3ª maior + 5ª justa (som alegre)', 'Menor: 3ª menor + 5ª justa (som triste)'],
  },
  {
    id: 'basico', numero: 2, nome: 'Básico', subtitulo: 'Dim, Aug e Suspensos',
    emoji: '⭐', cor: 'from-blue-500 to-indigo-600',
    qualidades: ['', 'm', 'dim', 'aug', 'sus2', 'sus4'], tonalidades: ['C', 'G', 'F', 'D', 'A', 'E', 'Bb', 'Eb'],
    questoesPorSessao: 10, xpPorQuestao: 20,
    dicasGerais: ['Diminuto: duas 3ªs menores (0-3-6)', 'Aumentado: duas 3ªs maiores (0-4-8)'],
  },
  {
    id: 'intermediario', numero: 3, nome: 'Intermediário', subtitulo: 'Tétrades com Sétima',
    emoji: '🔥', cor: 'from-amber-500 to-orange-600',
    qualidades: ['7', 'm7', 'maj7', 'm7b5', 'dim7', '6', 'm6'], tonalidades: ['C', 'G', 'F', 'D', 'A', 'E', 'Bb', 'Eb', 'Ab'],
    questoesPorSessao: 10, xpPorQuestao: 35,
    dicasGerais: ['7 (dominante): tensão que resolve', 'maj7: brilhante e moderno (jazz)'],
  },
  {
    id: 'avancado', numero: 4, nome: 'Avançado', subtitulo: 'Extensões: 9ª, 11ª, 13ª',
    emoji: '💎', cor: 'from-purple-500 to-violet-600',
    qualidades: ['9', 'm9', 'maj9', 'add9', '11', 'm11', '13', 'm13'], tonalidades: ['C', 'F', 'G', 'D', 'Bb', 'Eb'],
    questoesPorSessao: 10, xpPorQuestao: 50,
    dicasGerais: ['9ª = 2ª uma oitava acima', '13ª = 6ª uma oitava acima'],
  },
  {
    id: 'mestre', numero: 5, nome: 'Mestre', subtitulo: 'Alterados e Complexos',
    emoji: '👑', cor: 'from-rose-500 to-pink-600',
    qualidades: ['7b5', '7#5', '7b9', '7#9', '7#11', '7alt', '13b9'], tonalidades: ['C', 'F', 'G', 'D', 'Bb', 'Eb'],
    questoesPorSessao: 10, xpPorQuestao: 75,
    dicasGerais: ['7alt = todas as tensões alteradas', 'Hendrix chord = 7#9'],
  },
];

export function getNivel(id: string): NivelReconhecimento | undefined {
  return NIVEIS_RECONHECIMENTO.find((n) => n.id === id);
}
