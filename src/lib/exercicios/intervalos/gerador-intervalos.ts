/**
 * ============================================================
 * GERADOR DE QUESTÕES DE INTERVALOS
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';
import type { NivelIntervalos } from './niveis';
import { INTERVALOS_DATABASE, NOTAS_CROMATICAS, calcularNotaAlvo } from './database';

let _id = 0;
function uid() { return `iv-${++_id}-${Math.random().toString(36).slice(2, 5)}`; }
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export function gerarQuestoesIntervalos(nivel: NivelIntervalos, quantidade: number): Questao[] {
  const pool: Questao[] = [];
  const ivs = INTERVALOS_DATABASE.filter((i) => nivel.semitons.includes(i.semitons));
  const pts = nivel.xpPorQuestao;

  for (const raiz of shuffle(NOTAS_CROMATICAS).slice(0, 5)) {
    for (const iv of shuffle(ivs).slice(0, 4)) {
      const alvo = calcularNotaAlvo(raiz, iv.semitons);
      const dir = nivel.direcoes[Math.floor(Math.random() * nivel.direcoes.length)];
      const dirLabel = dir === 'ascendente' ? '↑' : dir === 'descendente' ? '↓' : '↕';

      // TYPE 1: Name the interval (MC)
      const wrongIvs = shuffle(ivs.filter((x) => x.semitons !== iv.semitons)).slice(0, 3);
      const opts1: OpcaoResposta[] = shuffle([
        { id: 'c', texto: iv.nome, ehCorreta: true },
        ...wrongIvs.map((w, i) => ({ id: `w${i}`, texto: w.nome, ehCorreta: false })),
      ]);

      pool.push({
        id: uid(), moduloId: 'intervalos', tipo: 'multipla-escolha', dificuldade: nivel.id as any,
        enunciado: `${dirLabel} Qual é o intervalo de ${raiz} até ${alvo}?`,
        enunciadoDetalhe: `Direção: ${dir}`,
        opcoes: opts1, respostaCorreta: 'c',
        dica: `${iv.nomeAbreviado} = ${iv.semitons} semitom${iv.semitons !== 1 ? 's' : ''}. Mnemônico: "${iv.mnemonico.ascendente}"`,
        explicacao: `${raiz} → ${alvo} = **${iv.nome}** (${iv.nomeAbreviado}). ${iv.semitons} semitons. Tipo: ${iv.tipo}. Mnemônico: "${iv.mnemonico.ascendente}".`,
        pontos: pts,
      });

      // TYPE 2: Find the target note (MC)
      const wrongNotes = shuffle(
        [-2, -1, 1, 2].map((d) => NOTAS_CROMATICAS[(NOTAS_CROMATICAS.indexOf(raiz) + iv.semitons + d + 12) % 12])
          .filter((n) => n !== alvo)
      ).slice(0, 3);
      const opts2: OpcaoResposta[] = shuffle([
        { id: 'c', texto: alvo, ehCorreta: true },
        ...wrongNotes.map((w, i) => ({ id: `w${i}`, texto: w, ehCorreta: false })),
      ]);

      pool.push({
        id: uid(), moduloId: 'intervalos', tipo: 'multipla-escolha', dificuldade: nivel.id as any,
        enunciado: `A partir de ${raiz}, qual nota forma uma ${iv.nome}?`,
        enunciadoDetalhe: `${iv.nomeAbreviado} = ${iv.semitons} semitons`,
        opcoes: opts2, respostaCorreta: 'c',
        dica: `${raiz} + ${iv.semitons} semitons = ?`,
        explicacao: `${raiz} + ${iv.semitons} st = **${alvo}**. ${iv.nome} (${iv.nomeAbreviado}).`,
        pontos: pts,
      });

      // TYPE 3: Classify type (perfeito/consonante/dissonante)
      if (nivel.semitons.length >= 8) {
        const tipoOpts: OpcaoResposta[] = [
          { id: 'perfeito', texto: '🔵 Perfeito', ehCorreta: iv.tipo === 'perfeito' },
          { id: 'consonante', texto: '🟢 Consonante', ehCorreta: iv.tipo === 'consonante' },
          { id: 'dissonante', texto: '🔴 Dissonante', ehCorreta: iv.tipo === 'dissonante' },
        ];
        pool.push({
          id: uid(), moduloId: 'intervalos', tipo: 'multipla-escolha', dificuldade: nivel.id as any,
          enunciado: `A ${iv.nome} é um intervalo:`,
          enunciadoDetalhe: `${raiz} → ${alvo} (${iv.semitons} semitons)`,
          opcoes: tipoOpts, respostaCorreta: tipoOpts.find((o) => o.ehCorreta)?.id || '',
          dica: 'Perfeitos: 1J, 4J, 5J, 8J | Consonantes: 3ª e 6ª | Dissonantes: 2ª, 7ª e TT',
          explicacao: `A ${iv.nome} é **${iv.tipo}**. ${iv.descricao}`,
          pontos: pts,
        });
      }
    }
  }

  return shuffle(pool).slice(0, quantidade);
}
