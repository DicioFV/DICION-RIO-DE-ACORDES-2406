/**
 * ============================================================
 * ENGINE DE FUNÇÃO HARMÔNICA (T / SD / D)
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';

const NOTAS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const INTERVALOS_MAIOR = [0, 2, 4, 5, 7, 9, 11];
const GRAUS_MAIOR = [
  { num: 1, rom: 'I', q: 'maj7', fn: 'T', nome: 'Tônica', sub: 'Tônica principal', tensao: 1 },
  { num: 2, rom: 'II', q: 'm7', fn: 'SD', nome: 'Subdominante', sub: 'II grau', tensao: 2 },
  { num: 3, rom: 'III', q: 'm7', fn: 'T', nome: 'Tônica', sub: 'Tônica relativa', tensao: 1 },
  { num: 4, rom: 'IV', q: 'maj7', fn: 'SD', nome: 'Subdominante', sub: 'SD principal', tensao: 2 },
  { num: 5, rom: 'V', q: '7', fn: 'D', nome: 'Dominante', sub: 'Dominante principal', tensao: 3 },
  { num: 6, rom: 'VI', q: 'm7', fn: 'T', nome: 'Tônica', sub: 'Relativa menor', tensao: 1 },
  { num: 7, rom: 'VII', q: 'm7b5', fn: 'D', nome: 'Dominante', sub: 'Sensível', tensao: 3 },
];

export interface CampoGrau {
  num: number; rom: string; nota: string; simbolo: string; fn: string; nome: string; sub: string; tensao: number;
}

export function gerarCampoMaior(ton: string): CampoGrau[] {
  const base = NOTAS.indexOf(ton);
  if (base < 0) return [];
  return GRAUS_MAIOR.map((g, i) => {
    const nota = NOTAS[(base + INTERVALOS_MAIOR[i]) % 12];
    return { num: g.num, rom: g.rom, nota, simbolo: `${nota}${g.q}`, fn: g.fn, nome: g.nome, sub: g.sub, tensao: g.tensao };
  });
}

let _id = 0;
function uid() { return `fh-${++_id}-${Math.random().toString(36).slice(2,5)}`; }
function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function gerarQuestoesFuncao(quantidade: number, dificuldade: string): Questao[] {
  const pool: Questao[] = [];
  const tons = ['C','G','F','D','Bb','A','Eb'];
  const pts: Record<string, number> = { intermediario: 35, avancado: 50, mestre: 75 };

  for (const ton of shuffle(tons).slice(0, 4)) {
    const campo = gerarCampoMaior(ton);

    for (const grau of campo) {
      // Q1: Which function?
      const optsFn: OpcaoResposta[] = [
        { id: 'T', texto: '🟢 Tônica (T)', ehCorreta: grau.fn === 'T' },
        { id: 'SD', texto: '🔵 Subdominante (SD)', ehCorreta: grau.fn === 'SD' },
        { id: 'D', texto: '🔴 Dominante (D)', ehCorreta: grau.fn === 'D' },
      ];
      pool.push({
        id: uid(), moduloId: 'funcao-harmonica', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Em ${ton} maior, qual a função de ${grau.simbolo}?`,
        enunciadoDetalhe: `Grau ${grau.rom}`,
        opcoes: optsFn, respostaCorreta: grau.fn,
        dica: 'T: I,III,VI | SD: II,IV | D: V,VII',
        explicacao: `**${grau.simbolo}** = grau **${grau.rom}** de ${ton} maior. Função: **${grau.nome} (${grau.fn})**. ${grau.sub}.`,
        pontos: pts[dificuldade] || 35,
      });

      // Q2: Which chord is the [function]?
      const wrong = shuffle(campo.filter(g => g.simbolo !== grau.simbolo)).slice(0, 3);
      const optsChord: OpcaoResposta[] = shuffle([
        { id: 'c', texto: grau.simbolo, ehCorreta: true },
        ...wrong.map((w, i) => ({ id: `w${i}`, texto: w.simbolo, ehCorreta: false })),
      ]);
      pool.push({
        id: uid(), moduloId: 'funcao-harmonica', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Qual acorde é ${grau.nome} (${grau.fn}) em ${ton} maior?`,
        enunciadoDetalhe: `${grau.sub} — grau ${grau.rom}`,
        opcoes: optsChord, respostaCorreta: 'c',
        explicacao: `**${grau.simbolo}** = grau ${grau.rom} de ${ton} maior. ${grau.nome}.`,
        pontos: pts[dificuldade] || 35,
      });
    }

    // Q3: Tritone substitution (avancado+)
    if (['avancado', 'mestre'].includes(dificuldade)) {
      const v = campo.find(g => g.num === 5)!;
      const tritonePc = (NOTAS.indexOf(v.nota) + 6) % 12;
      const subTritone = `${NOTAS[tritonePc]}7`;
      const optsTriton: OpcaoResposta[] = shuffle([
        { id: 'c', texto: subTritone, ehCorreta: true },
        { id: 'w0', texto: `${v.nota}m7`, ehCorreta: false },
        { id: 'w1', texto: `${NOTAS[(NOTAS.indexOf(v.nota) + 3) % 12]}m7`, ehCorreta: false },
        { id: 'w2', texto: 'Não existe', ehCorreta: false },
      ]);
      pool.push({
        id: uid(), moduloId: 'funcao-harmonica', tipo: 'multipla-escolha', dificuldade: dificuldade as any,
        enunciado: `Substituto do trítono de ${v.simbolo}?`,
        enunciadoDetalhe: `Dominante a 6 semitons do V`,
        opcoes: optsTriton, respostaCorreta: 'c',
        dica: 'SubV = dominante a um trítono (6 st) de distância',
        explicacao: `Substituto de **${v.simbolo}** = **${subTritone}**. Compartilham o mesmo trítono interno. Resolução cromática.`,
        pontos: (pts[dificuldade] || 50) + 15,
      });
    }
  }
  return shuffle(pool).slice(0, quantidade);
}
