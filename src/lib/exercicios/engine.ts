/**
 * ============================================================
 * ENGINE CENTRAL DE EXERCÍCIOS
 * ============================================================
 */
import type { SessaoExercicio, RespostaUsuario, ModuloId, ModoSessao, Dificuldade, ConfigModulo } from './tipos';
import { gerarQuestoes } from './gerador';
import { validarResposta } from './validador';
import { calcularXP } from './pontuacao';
import { verificarConquistas } from './conquistas';
import { atualizarPerfilPosSessao, salvarSessaoHistorico, carregarPerfil } from './persistencia';

export const MODULOS_CONFIG: Record<ModuloId, ConfigModulo> = {
  'reconhecimento-visual': { id: 'reconhecimento-visual', nome: 'Reconhecimento Visual', descricao: 'Identifique acordes pelo diagrama', emoji: '👁️', cor: 'from-indigo-500 to-blue-600', questoesPorSessao: 10, nivelMinimo: 'iniciante' },
  'intervalos': { id: 'intervalos', nome: 'Intervalos', descricao: 'Identifique intervalos musicais', emoji: '📏', cor: 'from-violet-500 to-purple-600', questoesPorSessao: 10, nivelMinimo: 'iniciante' },
  'inversoes': { id: 'inversoes', nome: 'Inversões', descricao: 'Identifique inversões de acordes', emoji: '🔄', cor: 'from-emerald-500 to-teal-600', questoesPorSessao: 10, nivelMinimo: 'basico' },
  'voicings': { id: 'voicings', nome: 'Voicings', descricao: 'Reconheça voicings profissionais', emoji: '🎹', cor: 'from-amber-500 to-orange-600', questoesPorSessao: 8, nivelMinimo: 'intermediario' },
  'funcao-harmonica': { id: 'funcao-harmonica', nome: 'Função Harmônica', descricao: 'Identifique T, SD e D', emoji: '🎼', cor: 'from-rose-500 to-pink-600', questoesPorSessao: 10, nivelMinimo: 'intermediario' },
  'progressoes': { id: 'progressoes', nome: 'Progressões', descricao: 'Analise progressões II-V-I', emoji: '🎵', cor: 'from-cyan-500 to-blue-600', questoesPorSessao: 8, nivelMinimo: 'avancado' },
};

let _sid = 0;

export function criarSessao(params: { moduloId: ModuloId; modo: ModoSessao; dificuldade: Dificuldade; totalQuestoes?: number }): SessaoExercicio {
  const config = MODULOS_CONFIG[params.moduloId];
  const total = params.totalQuestoes || config.questoesPorSessao;
  const questoes = gerarQuestoes({ moduloId: params.moduloId, dificuldade: params.dificuldade, quantidade: total });

  return {
    id: `s-${++_sid}-${Date.now()}`, moduloId: params.moduloId, modo: params.modo, dificuldade: params.dificuldade,
    status: 'em-andamento', questoes, respostas: [], questaoAtualIdx: 0,
    iniciadaEm: Date.now(), xpGanho: 0, acertos: 0, erros: 0,
    sequenciaAtual: 0, melhorSequencia: 0, totalQuestoes: total,
    tempoLimite: params.modo === 'desafio' ? 30 : undefined,
  };
}

export function processarResposta(sessao: SessaoExercicio, resposta: string, tempoResposta: number, usouDica: boolean) {
  const questao = sessao.questoes[sessao.questaoAtualIdx];
  if (!questao) throw new Error('No question');

  const correta = validarResposta(questao, resposta);
  const xpGanho = calcularXP({ pontos: questao.pontos, correta, tempoResposta, usouDica, streakAtual: sessao.sequenciaAtual, dificuldade: sessao.dificuldade, modo: sessao.modo });

  const respUsuario: RespostaUsuario = { questaoId: questao.id, resposta, correta, tempoResposta, usouDica, timestamp: Date.now() };
  const novaSeq = correta ? sessao.sequenciaAtual + 1 : 0;

  const updated: SessaoExercicio = {
    ...sessao,
    respostas: [...sessao.respostas, respUsuario],
    questaoAtualIdx: sessao.questaoAtualIdx + 1,
    xpGanho: sessao.xpGanho + xpGanho,
    acertos: correta ? sessao.acertos + 1 : sessao.acertos,
    erros: correta ? sessao.erros : sessao.erros + 1,
    sequenciaAtual: novaSeq,
    melhorSequencia: Math.max(sessao.melhorSequencia, novaSeq),
  };

  const feedback = correta
    ? (novaSeq >= 10 ? `🔥 INCRÍVEL! ${novaSeq} seguidas!` : novaSeq >= 5 ? `⚡ ${novaSeq} seguidas!` : ['✅ Correto!', '🎯 Perfeito!', '👏 Isso aí!'][Math.floor(Math.random() * 3)])
    : `❌ ${questao.explicacao}`;

  return { sessaoAtualizada: updated, correta, xpGanho, feedbackTexto: feedback };
}

export function finalizarSessao(sessao: SessaoExercicio) {
  const finalizada: SessaoExercicio = { ...sessao, status: 'concluida', finalizadaEm: Date.now() };
  salvarSessaoHistorico(finalizada);

  const perfil = carregarPerfil();
  const conquistasNovas = verificarConquistas(perfil, sessao.acertos, sessao.totalQuestoes, sessao.melhorSequencia);
  const perfilAtualizado = atualizarPerfilPosSessao(finalizada, conquistasNovas);

  return { sessao: finalizada, perfilAtualizado, conquistasNovas };
}
