/**
 * ============================================================
 * GERADOR DE QUESTÕES
 * ============================================================
 */
import type { Questao, ModuloId, Dificuldade, OpcaoResposta } from './tipos';
import { calcularPontosPorDificuldade } from './pontuacao';

const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUALIDADES_POR_NIVEL: Record<Dificuldade, string[]> = {
  iniciante: ['', 'm'],
  basico: ['', 'm', 'dim', 'aug', 'sus4'],
  intermediario: ['', 'm', 'dim', '7', 'm7', 'maj7', 'dim7', 'm7b5'],
  avancado: ['7', 'm7', 'maj7', '9', 'm9', 'maj9', '11', '13'],
  mestre: ['7b9', '7#9', '7#11', '7alt', '13b9', 'augMaj7'],
};

const NOMES_Q: Record<string, string> = {
  '': 'Maior', 'm': 'Menor', 'dim': 'Diminuto', 'aug': 'Aumentado', 'sus4': 'Sus4',
  '7': 'Dominante', 'm7': 'Menor 7', 'maj7': 'Maior 7', 'dim7': 'Dim 7', 'm7b5': 'Meio-dim',
  '9': 'Nona', 'm9': 'Menor 9', 'maj9': 'Maior 9', '11': '11ª', '13': '13ª',
  '7b9': '7b9', '7#9': '7#9', '7#11': '7#11', '7alt': 'Alterado', '13b9': '13b9', 'augMaj7': 'Aug Maj7',
};

const FORMULAS: Record<string, number[]> = {
  '': [0, 4, 7], 'm': [0, 3, 7], 'dim': [0, 3, 6], 'aug': [0, 4, 8], 'sus4': [0, 5, 7],
  '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], 'dim7': [0, 3, 6, 9], 'm7b5': [0, 3, 6, 10],
  '9': [0, 4, 7, 10, 14], 'm9': [0, 3, 7, 10, 14], 'maj9': [0, 4, 7, 11, 14],
};

const INTERVALOS = [
  { st: 0, nome: 'Uníssono' }, { st: 1, nome: '2ª menor' }, { st: 2, nome: '2ª maior' },
  { st: 3, nome: '3ª menor' }, { st: 4, nome: '3ª maior' }, { st: 5, nome: '4ª justa' },
  { st: 6, nome: 'Trítono' }, { st: 7, nome: '5ª justa' }, { st: 8, nome: '6ª menor' },
  { st: 9, nome: '6ª maior' }, { st: 10, nome: '7ª menor' }, { st: 11, nome: '7ª maior' },
  { st: 12, nome: 'Oitava' },
];

const INTERVALOS_POR_NIVEL: Record<Dificuldade, number[]> = {
  iniciante: [3, 4, 7, 12], basico: [3, 4, 5, 7, 8, 9, 12],
  intermediario: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  avancado: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  mestre: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

let _qid = 0;
function qid(): string { return `q-${++_qid}-${Math.random().toString(36).slice(2, 6)}`; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function notasDoAcorde(root: string, q: string): string[] {
  const f = FORMULAS[q]; if (!f) return [root];
  const idx = NOTAS.indexOf(root); if (idx < 0) return [root];
  return f.map((s) => NOTAS[(idx + s) % 12]);
}

export function gerarQuestoes(params: { moduloId: ModuloId; dificuldade: Dificuldade; quantidade: number }): Questao[] {
  // Use specialized generator for recognition if available
  if (params.moduloId === 'reconhecimento-visual') {
    try {
      const { gerarQuestoesReconhecimento } = require('./reconhecimento/gerador-reconhecimento');
      const { getNivel } = require('./reconhecimento/niveis');
      const nivel = getNivel(params.dificuldade);
      if (nivel) {
        return gerarQuestoesReconhecimento(nivel, params.quantidade);
      }
    } catch { /* fallback below */ }
  }

  // Use specialized generator for intervals
  if (params.moduloId === 'intervalos') {
    try {
      const { gerarQuestoesIntervalos } = require('./intervalos/gerador-intervalos');
      const { getNivelIntervalos } = require('./intervalos/niveis');
      const nivel = getNivelIntervalos(params.dificuldade);
      if (nivel) {
        return gerarQuestoesIntervalos(nivel, params.quantidade);
      }
    } catch { /* fallback below */ }
  }

  // Advanced modules
  if (params.moduloId === 'inversoes') {
    try {
      const { gerarQuestoesInversoes } = require('./avancados/inversoes');
      return gerarQuestoesInversoes(params.quantidade, params.dificuldade);
    } catch { /* fallback */ }
  }
  if (params.moduloId === 'voicings') {
    try {
      const { gerarQuestoesVoicings } = require('./avancados/voicings');
      return gerarQuestoesVoicings(params.quantidade, params.dificuldade);
    } catch { /* fallback */ }
  }
  if (params.moduloId === 'funcao-harmonica') {
    try {
      const { gerarQuestoesFuncao } = require('./avancados/funcao-harmonica');
      return gerarQuestoesFuncao(params.quantidade, params.dificuldade);
    } catch { /* fallback */ }
  }
  if (params.moduloId === 'progressoes') {
    try {
      const { gerarQuestoesProgressoes } = require('./avancados/progressoes');
      return gerarQuestoesProgressoes(params.quantidade, params.dificuldade);
    } catch { /* fallback */ }
  }

  const gen: Record<ModuloId, () => Questao[]> = {
    'reconhecimento-visual': () => gerarReconhecimento(params.dificuldade),
    'intervalos': () => gerarIntervalos(params.dificuldade),
    'inversoes': () => gerarInversoes(params.dificuldade),
    'voicings': () => gerarVoicings(params.dificuldade),
    'funcao-harmonica': () => gerarFuncHarm(params.dificuldade),
    'progressoes': () => gerarProgressoes(params.dificuldade),
  };
  const todas = (gen[params.moduloId] || (() => []))();
  return shuffle(todas).slice(0, params.quantidade);
}

function gerarReconhecimento(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const quals = QUALIDADES_POR_NIVEL[dif];
  const pts = calcularPontosPorDificuldade(dif);

  for (const nota of shuffle(NOTAS).slice(0, 6)) {
    for (const qual of shuffle(quals).slice(0, 3)) {
      const notas = notasDoAcorde(nota, qual);
      const simbolo = `${nota}${qual}`;
      const nome = `${nota} ${NOMES_Q[qual] || qual}`;

      // Notes → name (multiple choice)
      const wrongQuals = shuffle(quals.filter((q) => q !== qual)).slice(0, 3);
      const opts: OpcaoResposta[] = shuffle([
        { id: 'c', texto: simbolo, ehCorreta: true },
        ...wrongQuals.map((wq, i) => ({ id: `w${i}`, texto: `${nota}${wq}`, ehCorreta: false })),
      ]);

      qs.push({
        id: qid(), moduloId: 'reconhecimento-visual', tipo: 'multipla-escolha', dificuldade: dif,
        enunciado: `Notas: ${notas.join(' — ')}. Qual é o acorde?`,
        opcoes: opts, respostaCorreta: 'c',
        explicacao: `${simbolo} = ${nome}. Notas: ${notas.join(', ')}.`,
        pontos: pts,
      });
    }
  }
  return qs;
}

function gerarIntervalos(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const allowed = INTERVALOS_POR_NIVEL[dif];
  const ivs = INTERVALOS.filter((i) => allowed.includes(i.st));
  const pts = calcularPontosPorDificuldade(dif);

  for (const nota of shuffle(NOTAS).slice(0, 4)) {
    for (const iv of shuffle(ivs).slice(0, 4)) {
      const idx = NOTAS.indexOf(nota);
      const target = NOTAS[(idx + iv.st) % 12];
      const wrongIvs = shuffle(ivs.filter((x) => x.st !== iv.st)).slice(0, 3);
      const opts: OpcaoResposta[] = shuffle([
        { id: 'c', texto: iv.nome, ehCorreta: true },
        ...wrongIvs.map((w, i) => ({ id: `w${i}`, texto: w.nome, ehCorreta: false })),
      ]);

      qs.push({
        id: qid(), moduloId: 'intervalos', tipo: 'multipla-escolha', dificuldade: dif,
        enunciado: `Qual é o intervalo de ${nota} até ${target}?`,
        opcoes: opts, respostaCorreta: 'c',
        explicacao: `${nota} → ${target} = ${iv.nome} (${iv.st} semitom${iv.st !== 1 ? 's' : ''}).`,
        pontos: pts,
      });
    }
  }
  return qs;
}

function gerarInversoes(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const pts = calcularPontosPorDificuldade(dif) + 5;
  const quals = ['', 'm', '7', 'm7', 'maj7'];

  for (const nota of shuffle(NOTAS).slice(0, 4)) {
    for (const qual of shuffle(quals).slice(0, 2)) {
      const notas = notasDoAcorde(nota, qual);
      if (notas.length < 3) continue;
      for (let inv = 0; inv < Math.min(notas.length, 3); inv++) {
        const rotated = [...notas.slice(inv), ...notas.slice(0, inv)];
        const name = inv === 0 ? 'Estado fundamental' : `${inv}ª inversão`;
        const opts: OpcaoResposta[] = shuffle([
          { id: 'c', texto: name, ehCorreta: true },
          ...['Estado fundamental', '1ª inversão', '2ª inversão', '3ª inversão']
            .filter((n) => n !== name).slice(0, 3)
            .map((n, i) => ({ id: `w${i}`, texto: n, ehCorreta: false })),
        ]);
        qs.push({
          id: qid(), moduloId: 'inversoes', tipo: 'multipla-escolha', dificuldade: dif,
          enunciado: `${nota}${qual}: notas ${rotated.join(' — ')}. Qual inversão?`,
          opcoes: opts, respostaCorreta: 'c',
          explicacao: `Baixo: ${rotated[0]}. ${name}.`,
          pontos: pts,
        });
      }
    }
  }
  return qs;
}

function gerarVoicings(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const voicings = ['Close (cerrado)', 'Drop 2', 'Drop 3', 'Open (aberto)', 'Spread'];
  const pts = calcularPontosPorDificuldade(dif) + 10;

  for (const v of voicings.slice(0, 3)) {
    const opts: OpcaoResposta[] = shuffle(voicings.map((vv, i) => ({ id: `v${i}`, texto: vv, ehCorreta: vv === v })));
    qs.push({
      id: qid(), moduloId: 'voicings', tipo: 'multipla-escolha', dificuldade: dif,
      enunciado: `Identifique o voicing: "${v}"`,
      enunciadoDetalhe: descricaoVoicing(v),
      opcoes: opts, respostaCorreta: opts.find((o) => o.ehCorreta)?.id || '',
      explicacao: `Este é um voicing ${v}. ${descricaoVoicing(v)}`,
      pontos: pts,
    });
  }
  return qs;
}

function descricaoVoicing(v: string): string {
  const m: Record<string, string> = {
    'Close (cerrado)': 'Todas as notas dentro de uma oitava.',
    'Drop 2': 'A 2ª nota mais aguda desce uma oitava.',
    'Drop 3': 'A 3ª nota mais aguda desce uma oitava.',
    'Open (aberto)': 'Notas distribuídas em mais de uma oitava.',
    'Spread': 'Voicing muito aberto, com grandes intervalos.',
  };
  return m[v] || '';
}

function gerarFuncHarm(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const pts = calcularPontosPorDificuldade(dif) + 5;
  const graus = [
    { g: 'I', a: 'C', f: 'Tônica' }, { g: 'II', a: 'Dm', f: 'Subdominante' },
    { g: 'IV', a: 'F', f: 'Subdominante' }, { g: 'V', a: 'G7', f: 'Dominante' },
    { g: 'VI', a: 'Am', f: 'Tônica (relativa)' },
  ];
  const funcoes = ['Tônica', 'Subdominante', 'Dominante', 'Tônica (relativa)'];

  for (const gr of graus) {
    const opts: OpcaoResposta[] = shuffle(funcoes.map((f, i) => ({ id: `f${i}`, texto: f, ehCorreta: f === gr.f })));
    qs.push({
      id: qid(), moduloId: 'funcao-harmonica', tipo: 'multipla-escolha', dificuldade: dif,
      enunciado: `Em Dó maior, qual a função de ${gr.a} (grau ${gr.g})?`,
      opcoes: opts, respostaCorreta: opts.find((o) => o.ehCorreta)?.id || '',
      explicacao: `${gr.a} é o grau ${gr.g} de Dó maior. Função: ${gr.f}.`,
      pontos: pts,
    });
  }
  return qs;
}

function gerarProgressoes(dif: Dificuldade): Questao[] {
  const qs: Questao[] = [];
  const pts = calcularPontosPorDificuldade(dif) + 15;
  const progs = [
    { n: 'II-V-I maior', a: 'Dm7 → G7 → Cmaj7' },
    { n: 'I-IV-V-I', a: 'C → F → G → C' },
    { n: 'I-V-VI-IV', a: 'C → G → Am → F' },
    { n: 'I-VI-II-V', a: 'C → Am → Dm → G7' },
  ];

  for (const p of progs) {
    const opts: OpcaoResposta[] = shuffle(progs.map((pp, i) => ({ id: `p${i}`, texto: pp.n, ehCorreta: pp.n === p.n })));
    qs.push({
      id: qid(), moduloId: 'progressoes', tipo: 'multipla-escolha', dificuldade: dif,
      enunciado: `Identifique: ${p.a}`,
      opcoes: opts, respostaCorreta: opts.find((o) => o.ehCorreta)?.id || '',
      explicacao: `Esta é a progressão ${p.n}.`,
      pontos: pts,
    });
  }
  return qs;
}
