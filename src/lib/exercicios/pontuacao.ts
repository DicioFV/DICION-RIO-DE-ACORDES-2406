/**
 * ============================================================
 * SISTEMA DE PONTUAÇÃO XP E NÍVEIS
 * ============================================================
 */
import type { Dificuldade, ModoSessao } from './tipos';

export function calcularXP(params: {
  pontos: number;
  correta: boolean;
  tempoResposta: number;
  usouDica: boolean;
  streakAtual: number;
  dificuldade: Dificuldade;
  modo: ModoSessao;
}): number {
  if (!params.correta) return 0;

  let xp = params.pontos;

  // Time bonus
  const tempoSeg = params.tempoResposta / 1000;
  if (tempoSeg < 3) xp = Math.round(xp * 1.5);
  else if (tempoSeg < 5) xp = Math.round(xp * 1.3);
  else if (tempoSeg < 8) xp = Math.round(xp * 1.1);

  // Hint penalty
  if (params.usouDica) xp = Math.round(xp * 0.5);

  // Streak bonus
  if (params.streakAtual >= 10) xp = Math.round(xp * 2.0);
  else if (params.streakAtual >= 5) xp = Math.round(xp * 1.5);
  else if (params.streakAtual >= 3) xp = Math.round(xp * 1.25);

  // Challenge mode bonus
  if (params.modo === 'desafio') xp = Math.round(xp * 1.5);

  return Math.max(xp, 1);
}

export function calcularPontosPorDificuldade(d: Dificuldade): number {
  const map: Record<Dificuldade, number> = {
    iniciante: 10, basico: 20, intermediario: 35, avancado: 50, mestre: 75,
  };
  return map[d];
}

export const TABELA_NIVEIS = [
  { nivel: 1, xp: 0, titulo: '🌱 Aprendiz', cor: '#22c55e' },
  { nivel: 2, xp: 100, titulo: '⭐ Estudante', cor: '#3b82f6' },
  { nivel: 3, xp: 300, titulo: '🎵 Músico', cor: '#6366f1' },
  { nivel: 4, xp: 600, titulo: '🎸 Instrumentista', cor: '#8b5cf6' },
  { nivel: 5, xp: 1000, titulo: '🎹 Pianista', cor: '#a855f7' },
  { nivel: 6, xp: 1500, titulo: '🎼 Arranjador', cor: '#d946ef' },
  { nivel: 7, xp: 2200, titulo: '🎷 Improvisador', cor: '#f59e0b' },
  { nivel: 8, xp: 3000, titulo: '🎺 Harmonista', cor: '#ef4444' },
  { nivel: 9, xp: 4000, titulo: '🎻 Virtuose', cor: '#dc2626' },
  { nivel: 10, xp: 5500, titulo: '👑 Mestre', cor: '#fbbf24' },
];

export function calcularNivel(xpTotal: number) {
  let atual = TABELA_NIVEIS[0];
  for (const n of TABELA_NIVEIS) {
    if (xpTotal >= n.xp) atual = n;
    else break;
  }
  const idx = TABELA_NIVEIS.indexOf(atual);
  const prox = TABELA_NIVEIS[idx + 1];
  const xpNeste = xpTotal - atual.xp;
  const xpParaSubir = prox ? prox.xp - atual.xp : 99999;
  const progresso = prox ? Math.min(100, Math.round((xpNeste / xpParaSubir) * 100)) : 100;

  return { nivel: atual.nivel, titulo: atual.titulo, cor: atual.cor, xpAtual: xpNeste, xpProximo: xpParaSubir, progresso };
}
