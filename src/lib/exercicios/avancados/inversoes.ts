/**
 * ============================================================
 * ENGINE DE INVERSÕES
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';

const NOTAS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FORMULAS: Record<string, number[]> = {
  '': [0,4,7], 'm': [0,3,7], 'dim': [0,3,6], 'aug': [0,4,8],
  '7': [0,4,7,10], 'm7': [0,3,7,10], 'maj7': [0,4,7,11], 'dim7': [0,3,6,9], 'm7b5': [0,3,6,10],
};

export const TIPOS_INVERSAO = [
  { id: 'fundamental', nome: 'Estado Fundamental', abrev: 'Fund.', indice: 0, baixo: '1ª (raiz)', desc: 'A raiz está no baixo. Posição mais estável.' },
  { id: 'primeira', nome: '1ª Inversão', abrev: '1ª Inv.', indice: 1, baixo: '3ª', desc: 'A 3ª está no baixo. Som mais leve.' },
  { id: 'segunda', nome: '2ª Inversão', abrev: '2ª Inv.', indice: 2, baixo: '5ª', desc: 'A 5ª está no baixo. Tensão cadencial.' },
  { id: 'terceira', nome: '3ª Inversão', abrev: '3ª Inv.', indice: 3, baixo: '7ª', desc: 'A 7ª está no baixo (só tétrades). Muito instável.' },
];

function calcNotas(r: string, q: string): string[] {
  const f = FORMULAS[q]; if (!f) return [r];
  const i = NOTAS.indexOf(r); return f.map(s => NOTAS[(i + s) % 12]);
}

function inversoes(notas: string[]): string[][] {
  const res: string[][] = [notas];
  for (let i = 1; i < notas.length; i++) { const p = res[i-1]; res.push([...p.slice(1), p[0]]); }
  return res;
}

let _id = 0;
function uid() { return `inv-${++_id}-${Math.random().toString(36).slice(2,5)}`; }
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function gerarQuestoesInversoes(quantidade: number, dificuldade: string): Questao[] {
  const pool: Questao[] = [];
  const quals: Record<string, string[]> = {
    basico: ['','m'], intermediario: ['','m','7','m7','maj7'], avancado: ['','m','7','m7','maj7','dim7','m7b5'], mestre: ['','m','7','m7','maj7','dim7','m7b5','aug','dim'],
  };
  const qs = quals[dificuldade] || ['','m'];
  const pts: Record<string, number> = { basico: 20, intermediario: 35, avancado: 50, mestre: 75 };

  for (const r of shuffle(['C','F','G','D','A','Bb']).slice(0,4)) {
    for (const q of shuffle(qs).slice(0,3)) {
      const notas = calcNotas(r, q);
      const invs = inversoes(notas);
      const sym = `${r}${q}`;

      invs.forEach((inv, idx) => {
        if (idx >= notas.length) return;
        if (idx === 3 && notas.length < 4) return;
        const tipo = TIPOS_INVERSAO[idx];

        const opts: OpcaoResposta[] = shuffle(
          TIPOS_INVERSAO.slice(0, notas.length).map(t => ({ id: t.id, texto: t.nome, ehCorreta: t.id === tipo.id }))
        );

        pool.push({
          id: uid(), moduloId: 'inversoes', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
          enunciado: `Qual inversão de ${sym}?`,
          enunciadoDetalhe: `Notas (grave→agudo): ${inv.join(' — ')}`,
          opcoes: opts, respostaCorreta: tipo.id,
          dica: `Observe o baixo: ${inv[0]} = ${tipo.baixo} de ${sym}`,
          explicacao: `**${tipo.nome}** de ${sym}: ${inv.join('-')}. ${tipo.desc} Baixo: ${inv[0]}.`,
          pontos: (pts[dificuldade] || 20) + 5,
        });
      });
    }
  }
  return shuffle(pool).slice(0, quantidade);
}
