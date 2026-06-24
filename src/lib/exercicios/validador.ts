/**
 * ============================================================
 * VALIDADOR DE RESPOSTAS
 * ============================================================
 */
import type { Questao } from './tipos';

export function validarResposta(questao: Questao, resposta: string): boolean {
  const r = normalizar(resposta);
  const c = normalizar(questao.respostaCorreta);

  if (r === c) return true;

  // Check accepted variants
  if (questao.respostasAceitas?.some((a) => normalizar(a) === r)) return true;

  // For multiple choice, direct comparison
  if (questao.tipo === 'multipla-escolha') return r === c;

  // For typing, check equivalences
  return r === c;
}

function normalizar(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '').replace(/♯/g, '#').replace(/♭/g, 'b').replace(/Δ/g, 'maj').replace(/°/g, 'dim').replace(/ø/g, 'm7b5');
}
