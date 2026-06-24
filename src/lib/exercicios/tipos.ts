/**
 * ============================================================
 * TIPOS GLOBAIS DO SISTEMA DE EXERCÍCIOS
 * ============================================================
 */

export type ModuloId = 'reconhecimento-visual' | 'intervalos' | 'inversoes' | 'voicings' | 'funcao-harmonica' | 'progressoes';

export type TipoQuestao = 'multipla-escolha' | 'verdadeiro-falso' | 'digitacao';

export type Dificuldade = 'iniciante' | 'basico' | 'intermediario' | 'avancado' | 'mestre';

export type ModoSessao = 'treino' | 'desafio' | 'revisao';

export interface OpcaoResposta {
  id: string;
  texto: string;
  ehCorreta: boolean;
}

export interface Questao {
  id: string;
  moduloId: ModuloId;
  tipo: TipoQuestao;
  dificuldade: Dificuldade;
  enunciado: string;
  enunciadoDetalhe?: string;
  opcoes?: OpcaoResposta[];
  respostaCorreta: string;
  respostasAceitas?: string[];
  dica?: string;
  explicacao: string;
  pontos: number;
}

export interface RespostaUsuario {
  questaoId: string;
  resposta: string;
  correta: boolean;
  tempoResposta: number;
  usouDica: boolean;
  timestamp: number;
}

export interface SessaoExercicio {
  id: string;
  moduloId: ModuloId;
  modo: ModoSessao;
  dificuldade: Dificuldade;
  status: 'em-andamento' | 'concluida' | 'abandonada';
  questoes: Questao[];
  respostas: RespostaUsuario[];
  questaoAtualIdx: number;
  iniciadaEm: number;
  finalizadaEm?: number;
  xpGanho: number;
  acertos: number;
  erros: number;
  sequenciaAtual: number;
  melhorSequencia: number;
  totalQuestoes: number;
  tempoLimite?: number;
}

export interface PerfilJogador {
  xpTotal: number;
  nivel: number;
  streakAtual: number;
  melhorStreak: number;
  ultimaAtividade: number;
  sessoesTotal: number;
  questoesRespondidas: number;
  acertosTotal: number;
  conquistasDesbloqueadas: string[];
  dificuldadeAtual: Dificuldade;
}

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
  xpBonus: number;
  condicao: (perfil: PerfilJogador, acertos?: number, total?: number, streak?: number) => boolean;
}

export interface ConfigModulo {
  id: ModuloId;
  nome: string;
  descricao: string;
  emoji: string;
  cor: string;
  questoesPorSessao: number;
  nivelMinimo: Dificuldade;
}
