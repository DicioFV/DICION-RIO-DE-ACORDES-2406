/**
 * ============================================================
 * ENGINE DE VOICINGS
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';

export const TIPOS_VOICING = [
  { id: 'close', nome: 'Close (cerrado)', desc: 'Notas dentro de uma oitava.', uso: 'Piano clássico, coral', dif: 1 },
  { id: 'open', nome: 'Open (aberto)', desc: 'Notas em mais de uma oitava.', uso: 'Orquestra, arranjos', dif: 1 },
  { id: 'drop2', nome: 'Drop 2', desc: '2ª nota do topo desce uma oitava.', uso: 'Jazz piano, guitarra', dif: 2 },
  { id: 'drop3', nome: 'Drop 3', desc: '3ª nota do topo desce uma oitava.', uso: 'Coral jazz, trombones', dif: 2 },
  { id: 'drop24', nome: 'Drop 2&4', desc: '2ª e 4ª notas descem uma oitava.', uso: 'Big band, saxofones', dif: 3 },
  { id: 'rootless', nome: 'Rootless', desc: 'Sem fundamental (baixista toca).', uso: 'Jazz piano profissional', dif: 3 },
  { id: 'quartal', nome: 'Quartal', desc: 'Empilhamento por quartas.', uso: 'Jazz modal, McCoy Tyner', dif: 3 },
];

let _id = 0;
function uid() { return `voi-${++_id}-${Math.random().toString(36).slice(2,5)}`; }
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function gerarQuestoesVoicings(quantidade: number, dificuldade: string): Questao[] {
  const pool: Questao[] = [];
  const byLevel: Record<string, string[]> = {
    intermediario: ['close','open'], avancado: ['close','open','drop2','drop3'], mestre: ['close','open','drop2','drop3','drop24','rootless','quartal'],
  };
  const vIds = byLevel[dificuldade] || ['close','open'];
  const vs = TIPOS_VOICING.filter(v => vIds.includes(v.id));
  const pts: Record<string, number> = { intermediario: 35, avancado: 50, mestre: 75 };
  const acordes = ['Cmaj7','Dm7','G7','Fmaj7','Am7','Bbmaj7'];

  for (const ac of shuffle(acordes).slice(0,4)) {
    for (const v of shuffle(vs).slice(0,3)) {
      // Identify voicing
      const opts: OpcaoResposta[] = shuffle(vs.map(vv => ({ id: vv.id, texto: vv.nome, ehCorreta: vv.id === v.id })));
      pool.push({
        id: uid(), moduloId: 'voicings', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Qual tipo de voicing de ${ac}?`,
        enunciadoDetalhe: v.desc,
        opcoes: opts, respostaCorreta: v.id,
        dica: `${v.nome}: ${v.desc}`,
        explicacao: `**${v.nome}** de ${ac}. ${v.desc} Usado em: ${v.uso}.`,
        pontos: (pts[dificuldade] || 35) + v.dif * 10,
      });

      // V/F about characteristics
      const correct = Math.random() > 0.5;
      const statement = correct ? v.desc : (vs.find(x => x.id !== v.id)?.desc || v.uso);
      pool.push({
        id: uid(), moduloId: 'voicings', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Sobre o voicing ${v.nome} de ${ac}:`,
        enunciadoDetalhe: `"${statement}"`,
        opcoes: [
          { id: 'v', texto: '✅ Verdadeiro', ehCorreta: correct },
          { id: 'f', texto: '❌ Falso', ehCorreta: !correct },
        ],
        respostaCorreta: correct ? 'v' : 'f',
        explicacao: `${v.nome}: ${v.desc} Usado em: ${v.uso}.`,
        pontos: pts[dificuldade] || 35,
      });
    }
  }
  return shuffle(pool).slice(0, quantidade);
}
