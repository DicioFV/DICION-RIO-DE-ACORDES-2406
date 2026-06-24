/**
 * ============================================================
 * PERSISTÊNCIA — localStorage
 * ============================================================
 */
import type { PerfilJogador, SessaoExercicio } from './tipos';
import { calcularNivel } from './pontuacao';

const KEYS = { PERFIL: 'musicverse:exercicios-perfil', HISTORICO: 'musicverse:exercicios-historico' };

function criarPerfilPadrao(): PerfilJogador {
  return {
    xpTotal: 0, nivel: 1, streakAtual: 0, melhorStreak: 0, ultimaAtividade: 0,
    sessoesTotal: 0, questoesRespondidas: 0, acertosTotal: 0,
    conquistasDesbloqueadas: [], dificuldadeAtual: 'iniciante',
  };
}

export function carregarPerfil(): PerfilJogador {
  try {
    const raw = localStorage.getItem(KEYS.PERFIL);
    return raw ? JSON.parse(raw) : criarPerfilPadrao();
  } catch { return criarPerfilPadrao(); }
}

export function salvarPerfil(perfil: PerfilJogador): void {
  const { nivel } = calcularNivel(perfil.xpTotal);
  localStorage.setItem(KEYS.PERFIL, JSON.stringify({ ...perfil, nivel }));
}

export function atualizarPerfilPosSessao(sessao: SessaoExercicio, conquistasNovas: string[]): PerfilJogador {
  const perfil = carregarPerfil();
  const agora = Date.now();

  // Streak
  const umDia = 86400000;
  const diff = agora - perfil.ultimaAtividade;
  let streak = perfil.streakAtual;
  if (diff < umDia) { /* same day */ }
  else if (diff < 2 * umDia) { streak++; }
  else { streak = 1; }

  const { nivel } = calcularNivel(perfil.xpTotal + sessao.xpGanho);

  const updated: PerfilJogador = {
    ...perfil,
    xpTotal: perfil.xpTotal + sessao.xpGanho,
    nivel,
    streakAtual: streak,
    melhorStreak: Math.max(perfil.melhorStreak, streak),
    ultimaAtividade: agora,
    sessoesTotal: perfil.sessoesTotal + 1,
    questoesRespondidas: perfil.questoesRespondidas + sessao.totalQuestoes,
    acertosTotal: perfil.acertosTotal + sessao.acertos,
    conquistasDesbloqueadas: [...perfil.conquistasDesbloqueadas, ...conquistasNovas],
  };

  salvarPerfil(updated);
  return updated;
}

export function salvarSessaoHistorico(sessao: SessaoExercicio): void {
  try {
    const raw = localStorage.getItem(KEYS.HISTORICO);
    const hist: SessaoExercicio[] = raw ? JSON.parse(raw) : [];
    hist.unshift(sessao);
    localStorage.setItem(KEYS.HISTORICO, JSON.stringify(hist.slice(0, 50)));
  } catch { /* ignore */ }
}

export function carregarHistorico(): SessaoExercicio[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORICO);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
