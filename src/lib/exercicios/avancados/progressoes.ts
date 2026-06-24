/**
 * ============================================================
 * ENGINE DE PROGRESSÕES HARMÔNICAS
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';

export interface Progressao {
  id: string; nome: string; nomeCompleto: string;
  graus: string[]; exemplo: string[]; tom: string;
  generos: string[]; analise: string; dificuldade: 1 | 2 | 3;
  exemplosMusicas: string[];
}

export const PROGRESSOES: Progressao[] = [
  { id: 'I-IV-V-I', nome: 'I-IV-V-I', nomeCompleto: 'Cadência Perfeita', graus: ['I','IV','V','I'], exemplo: ['C','F','G','C'], tom: 'C', generos: ['Rock','Pop','Blues','Gospel'], analise: 'T→SD→D→T. Ciclo completo.', dificuldade: 1, exemplosMusicas: ['La Bamba','Twist and Shout'] },
  { id: 'I-V-VI-IV', nome: 'I-V-VI-IV', nomeCompleto: 'Progressão Pop', graus: ['I','V','VI','IV'], exemplo: ['C','G','Am','F'], tom: 'C', generos: ['Pop','Rock','Indie'], analise: 'T→D→T(rel)→SD.', dificuldade: 1, exemplosMusicas: ['Let It Be','Someone Like You'] },
  { id: 'I-VI-II-V', nome: 'I-VI-II-V', nomeCompleto: 'Turnaround', graus: ['I','VI','II','V'], exemplo: ['C','Am','Dm','G7'], tom: 'C', generos: ['Jazz','Pop 50s','Bossa'], analise: 'T→T(rel)→SD→D.', dificuldade: 1, exemplosMusicas: ['Blue Moon','Heart and Soul'] },
  { id: 'II-V-I-maj', nome: 'II-V-I Maior', nomeCompleto: 'Cadência II-V-I Maior', graus: ['IIm7','V7','Imaj7'], exemplo: ['Dm7','G7','Cmaj7'], tom: 'C', generos: ['Jazz','Bossa','MPB','Gospel'], analise: 'SD→D→T. A mais importante do jazz.', dificuldade: 2, exemplosMusicas: ['Autumn Leaves','Fly Me to the Moon'] },
  { id: 'II-V-I-min', nome: 'II-V-I Menor', nomeCompleto: 'Cadência II-V-I Menor', graus: ['IIø','V7b9','Im'], exemplo: ['Dm7b5','G7b9','Cm'], tom: 'Cm', generos: ['Jazz','Bossa','Flamenco'], analise: 'IIø→V7b9→Im. Tensão dramática.', dificuldade: 2, exemplosMusicas: ['Summertime','So What'] },
  { id: 'I-IVm-I', nome: 'I-IVm-I', nomeCompleto: 'Empréstimo Modal (IVm)', graus: ['I','IVm','I'], exemplo: ['C','Fm','C'], tom: 'C', generos: ['Gospel','Soul','MPB'], analise: 'IVm emprestado do modo menor.', dificuldade: 2, exemplosMusicas: ['Yesterday','No Surprises'] },
  { id: 'blues-12', nome: 'Blues 12', nomeCompleto: 'Blues de 12 Compassos', graus: ['I7','I7','I7','I7','IV7','IV7','I7','I7','V7','IV7','I7','V7'], exemplo: ['C7','C7','C7','C7','F7','F7','C7','C7','G7','F7','C7','G7'], tom: 'C', generos: ['Blues','Rock','Jazz'], analise: 'I7,IV7,V7 — todos dominantes.', dificuldade: 2, exemplosMusicas: ['Johnny B. Goode','Hound Dog'] },
  { id: 'tritone-sub', nome: 'SubV→I', nomeCompleto: 'Substituição do Trítono', graus: ['V7','SubV7','I'], exemplo: ['G7','Db7','Cmaj7'], tom: 'C', generos: ['Jazz avançado','Bebop'], analise: 'Db7 substitui G7 (trítono compartilhado).', dificuldade: 3, exemplosMusicas: ['All the Things You Are'] },
  { id: 'modal-int', nome: 'I-bVII-IV', nomeCompleto: 'Modal Interchange', graus: ['I','♭VII','IV'], exemplo: ['C','Bb','F'], tom: 'C mixolídio', generos: ['Rock','Pop','Soul'], analise: '♭VII do modo mixolídio.', dificuldade: 3, exemplosMusicas: ['Hey Jude','Sweet Home Alabama'] },
];

let _id = 0;
function uid() { return `pg-${++_id}-${Math.random().toString(36).slice(2,5)}`; }
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function gerarQuestoesProgressoes(quantidade: number, dificuldade: string): Questao[] {
  const pool: Questao[] = [];
  const byLevel: Record<string, number> = { avancado: 2, mestre: 3 };
  const maxDif = byLevel[dificuldade] || 2;
  const progs = PROGRESSOES.filter(p => p.dificuldade <= maxDif);
  const pts: Record<string, number> = { avancado: 50, mestre: 75 };

  for (const prog of progs) {
    // Q1: Chords → name
    const optsName: OpcaoResposta[] = shuffle([
      { id: 'c', texto: prog.nome, ehCorreta: true },
      ...shuffle(progs.filter(p => p.id !== prog.id)).slice(0, 3).map((p, i) => ({ id: `w${i}`, texto: p.nome, ehCorreta: false })),
    ]);
    pool.push({
      id: uid(), moduloId: 'progressoes', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
      enunciado: `Identifique: ${prog.exemplo.slice(0, 4).join(' → ')}`,
      enunciadoDetalhe: `Tom: ${prog.tom}`,
      opcoes: optsName, respostaCorreta: 'c',
      dica: `Graus: ${prog.graus.slice(0, 4).join(' → ')}`,
      explicacao: `**${prog.nome}** — ${prog.nomeCompleto}. ${prog.analise} Gêneros: ${prog.generos.join(', ')}. Ex: ${prog.exemplosMusicas[0] || ''}.`,
      pontos: (pts[dificuldade] || 50) + prog.dificuldade * 10,
    });

    // Q2: Grades → full name
    const optsFull: OpcaoResposta[] = shuffle([
      { id: 'c', texto: prog.nomeCompleto, ehCorreta: true },
      ...shuffle(progs.filter(p => p.id !== prog.id)).slice(0, 3).map((p, i) => ({ id: `w${i}`, texto: p.nomeCompleto, ehCorreta: false })),
    ]);
    pool.push({
      id: uid(), moduloId: 'progressoes', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
      enunciado: `${prog.graus.slice(0, 4).join('-')} é chamada de:`,
      enunciadoDetalhe: prog.analise,
      opcoes: optsFull, respostaCorreta: 'c',
      explicacao: `**${prog.nome}** = ${prog.nomeCompleto}. ${prog.analise}`,
      pontos: pts[dificuldade] || 50,
    });

    // Q3: Complete the progression
    if (prog.exemplo.length >= 3 && prog.exemplo.length <= 5) {
      const missing = Math.floor(Math.random() * Math.min(prog.exemplo.length, 4));
      const shown = prog.exemplo.slice(0, 4).map((a, i) => i === missing ? '???' : a);
      const answer = prog.exemplo[missing];
      const wrongChords = ['Am','Dm7','F#dim','Bbmaj7','E7'].filter(c => c !== answer).slice(0, 3);
      pool.push({
        id: uid(), moduloId: 'progressoes', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Complete ${prog.nome}: ${shown.join(' → ')}`,
        enunciadoDetalhe: `Tom: ${prog.tom}`,
        opcoes: shuffle([
          { id: 'c', texto: answer, ehCorreta: true },
          ...wrongChords.map((w, i) => ({ id: `w${i}`, texto: w, ehCorreta: false })),
        ]),
        respostaCorreta: 'c',
        dica: `Grau faltando: ${prog.graus[missing]}`,
        explicacao: `${prog.nome}: ${prog.exemplo.slice(0, 4).join(' → ')}. ${prog.analise}`,
        pontos: (pts[dificuldade] || 50) + 5,
      });
    }
  }
  return shuffle(pool).slice(0, quantidade);
}
