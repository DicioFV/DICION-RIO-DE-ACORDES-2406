/**
 * ============================================================
 * SISTEMA DE CONQUISTAS (BADGES)
 * ============================================================
 */
import type { Conquista, PerfilJogador } from './tipos';

export const TODAS_CONQUISTAS: Conquista[] = [
  { id: 'primeira-questao', nome: 'Primeiro Acorde!', descricao: 'Respondeu a primeira questão', emoji: '🎵', raridade: 'comum', xpBonus: 25,
    condicao: (p) => p.questoesRespondidas >= 1 },
  { id: 'primeira-sessao', nome: 'Trilha Iniciada', descricao: 'Completou a primeira sessão', emoji: '🌱', raridade: 'comum', xpBonus: 50,
    condicao: (p) => p.sessoesTotal >= 1 },
  { id: '50-questoes', nome: 'Meio Centenário', descricao: '50 questões respondidas', emoji: '📚', raridade: 'comum', xpBonus: 100,
    condicao: (p) => p.questoesRespondidas >= 50 },
  { id: '100-questoes', nome: 'Centenário', descricao: '100 questões respondidas', emoji: '💯', raridade: 'comum', xpBonus: 200,
    condicao: (p) => p.questoesRespondidas >= 100 },
  { id: '500-questoes', nome: 'Incansável', descricao: '500 questões respondidas', emoji: '⚡', raridade: 'raro', xpBonus: 500,
    condicao: (p) => p.questoesRespondidas >= 500 },
  { id: 'sessao-perfeita', nome: 'Sessão Perfeita!', descricao: '100% em uma sessão', emoji: '🎯', raridade: 'raro', xpBonus: 200,
    condicao: (_, acertos, total) => !!total && total > 0 && acertos === total },
  { id: 'streak-3', nome: 'Em Ritmo', descricao: '3 dias consecutivos', emoji: '🔥', raridade: 'comum', xpBonus: 75,
    condicao: (p) => p.streakAtual >= 3 },
  { id: 'streak-7', nome: 'Semana Perfeita', descricao: '7 dias consecutivos', emoji: '📅', raridade: 'raro', xpBonus: 200,
    condicao: (p) => p.streakAtual >= 7 },
  { id: 'streak-30', nome: 'Mês Inabalável', descricao: '30 dias consecutivos', emoji: '🏆', raridade: 'epico', xpBonus: 1000,
    condicao: (p) => p.streakAtual >= 30 },
  { id: 'sequencia-5', nome: 'Sequência de Fogo', descricao: '5 acertos seguidos', emoji: '⚡', raridade: 'comum', xpBonus: 50,
    condicao: (_, _a, _t, streak) => !!streak && streak >= 5 },
  { id: 'sequencia-10', nome: 'Imparável!', descricao: '10 acertos seguidos', emoji: '🚀', raridade: 'raro', xpBonus: 150,
    condicao: (_, _a, _t, streak) => !!streak && streak >= 10 },
  { id: 'nivel-5', nome: 'Pianista!', descricao: 'Nível 5 alcançado', emoji: '🎹', raridade: 'raro', xpBonus: 300,
    condicao: (p) => p.nivel >= 5 },
  { id: 'nivel-10', nome: 'Mestre da Harmonia', descricao: 'Nível 10 alcançado', emoji: '👑', raridade: 'lendario', xpBonus: 2000,
    condicao: (p) => p.nivel >= 10 },
];

export function verificarConquistas(perfil: PerfilJogador, acertos?: number, total?: number, streak?: number): string[] {
  const novas: string[] = [];
  for (const c of TODAS_CONQUISTAS) {
    if (perfil.conquistasDesbloqueadas.includes(c.id)) continue;
    try { if (c.condicao(perfil, acertos, total, streak)) novas.push(c.id); } catch { /* ignore */ }
  }
  return novas;
}

export function getConquista(id: string): Conquista | undefined {
  return TODAS_CONQUISTAS.find((c) => c.id === id);
}
