/**
 * ============================================================
 * 5 NÍVEIS DE INTERVALOS
 * ============================================================
 */

export interface NivelIntervalos {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string;
  emoji: string;
  cor: string;
  semitons: number[];
  direcoes: Array<'ascendente' | 'descendente' | 'harmonico'>;
  questoesPorSessao: number;
  tempoLimiteDesafio: number;
  xpPorQuestao: number;
  dicas: string[];
}

export const NIVEIS_INTERVALOS: NivelIntervalos[] = [
  {
    id: 'iniciante', numero: 1, nome: 'Iniciante', subtitulo: '3ª e 5ª — Fundamentais',
    emoji: '🌱', cor: 'from-emerald-500 to-green-600',
    semitons: [3, 4, 7, 12], direcoes: ['ascendente'],
    questoesPorSessao: 10, tempoLimiteDesafio: 30, xpPorQuestao: 10,
    dicas: ['3ª menor = 3 st → som menor', '3ª maior = 4 st → som maior', '5ª justa = 7 st → power chord'],
  },
  {
    id: 'basico', numero: 2, nome: 'Básico', subtitulo: '2ªs, 4ª, 6ªs + descendente',
    emoji: '⭐', cor: 'from-blue-500 to-indigo-600',
    semitons: [2, 3, 4, 5, 7, 8, 9, 12], direcoes: ['ascendente', 'descendente'],
    questoesPorSessao: 10, tempoLimiteDesafio: 25, xpPorQuestao: 20,
    dicas: ['4ª justa = inversão da 5ª', '6ª menor = inversão da 3ª maior'],
  },
  {
    id: 'intermediario', numero: 3, nome: 'Intermediário', subtitulo: 'Todos os 13 + Trítono',
    emoji: '🔥', cor: 'from-amber-500 to-orange-600',
    semitons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], direcoes: ['ascendente', 'descendente'],
    questoesPorSessao: 10, tempoLimiteDesafio: 20, xpPorQuestao: 35,
    dicas: ['Trítono = 6 st → metade da oitava', '7ª menor = base do dominante'],
  },
  {
    id: 'avancado', numero: 4, nome: 'Avançado', subtitulo: 'Classificação + Harmônico',
    emoji: '💎', cor: 'from-purple-500 to-violet-600',
    semitons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], direcoes: ['ascendente', 'descendente', 'harmonico'],
    questoesPorSessao: 10, tempoLimiteDesafio: 15, xpPorQuestao: 50,
    dicas: ['Perfeitos: 1J, 4J, 5J, 8J', 'Inversão: 2↔7, 3↔6, 4↔5'],
  },
  {
    id: 'mestre', numero: 5, nome: 'Mestre', subtitulo: 'Velocidade máxima',
    emoji: '👑', cor: 'from-rose-500 to-pink-600',
    semitons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], direcoes: ['ascendente', 'descendente', 'harmonico'],
    questoesPorSessao: 15, tempoLimiteDesafio: 10, xpPorQuestao: 75,
    dicas: ['Reconhecimento instantâneo é o objetivo', 'Use mnemônicos como atalho'],
  },
];

export function getNivelIntervalos(id: string) {
  return NIVEIS_INTERVALOS.find((n) => n.id === id);
}
