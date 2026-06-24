/**
 * ============================================================
 * GERADOR ESPECÍFICO — RECONHECIMENTO VISUAL
 * ============================================================
 */
import type { Questao, OpcaoResposta } from '../tipos';
import type { NivelReconhecimento } from './niveis';

const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FORMULAS: Record<string, number[]> = {
  '': [0, 4, 7], 'm': [0, 3, 7], 'dim': [0, 3, 6], 'aug': [0, 4, 8],
  'sus2': [0, 2, 7], 'sus4': [0, 5, 7],
  '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11],
  'dim7': [0, 3, 6, 9], 'm7b5': [0, 3, 6, 10],
  '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9],
  '9': [0, 4, 7, 10, 14], 'm9': [0, 3, 7, 10, 14], 'maj9': [0, 4, 7, 11, 14],
  'add9': [0, 4, 7, 14], '11': [0, 4, 7, 10, 14, 17], 'm11': [0, 3, 7, 10, 14, 17],
  '13': [0, 4, 7, 10, 14, 17, 21], 'm13': [0, 3, 7, 10, 14, 17, 21],
  '7b5': [0, 4, 6, 10], '7#5': [0, 4, 8, 10], '7b9': [0, 4, 7, 10, 13],
  '7#9': [0, 4, 7, 10, 15], '7#11': [0, 4, 7, 10, 18], '7alt': [0, 4, 6, 10, 13, 15],
  '13b9': [0, 4, 7, 10, 13, 21],
};

const NOMES_Q: Record<string, string> = {
  '': 'Maior', 'm': 'Menor', 'dim': 'Diminuto', 'aug': 'Aumentado',
  'sus2': 'Sus2', 'sus4': 'Sus4', '7': 'Dominante', 'm7': 'Menor 7',
  'maj7': 'Maior 7', 'dim7': 'Dim 7', 'm7b5': 'Meio-dim', '6': 'Sexta', 'm6': 'Menor 6',
  '9': 'Nona', 'm9': 'Menor 9', 'maj9': 'Maior 9', 'add9': 'Add9',
  '11': '11ª', 'm11': 'Menor 11ª', '13': '13ª', 'm13': 'Menor 13ª',
  '7b5': '7b5', '7#5': '7#5', '7b9': '7b9', '7#9': '7#9 (Hendrix)',
  '7#11': '7#11 (Lídio)', '7alt': 'Alterado', '13b9': '13b9',
};

let _id = 0;
function uid() { return `rec-${++_id}-${Math.random().toString(36).slice(2, 5)}`; }
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function notasDoAcorde(root: string, q: string): string[] {
  const f = FORMULAS[q]; if (!f) return [root];
  const idx = NOTAS.indexOf(root); if (idx < 0) return [root];
  return f.map((s) => NOTAS[(idx + s) % 12]);
}

function simbolo(root: string, q: string): string {
  return `${root}${q}`;
}

function variantes(root: string, q: string): string[] {
  const s = simbolo(root, q);
  const vars = [s];
  const map: Record<string, string[]> = {
    '': ['', 'M', 'maj'], 'm': ['m', 'min', '-'], 'maj7': ['maj7', 'Δ7', 'M7'],
    'm7': ['m7', 'min7', '-7'], 'dim': ['dim', '°'], 'aug': ['aug', '+'],
    'm7b5': ['m7b5', 'ø', 'ø7'], 'dim7': ['dim7', 'o7', '°7'],
  };
  (map[q] || []).forEach((v) => { if (v !== q) vars.push(`${root}${v}`); });
  return vars;
}

/**
 * Generates questions for a specific recognition level
 */
export function gerarQuestoesReconhecimento(
  nivel: NivelReconhecimento,
  quantidade: number
): Questao[] {
  const pool: Questao[] = [];
  const pts = nivel.xpPorQuestao;

  for (const root of shuffle(nivel.tonalidades).slice(0, 6)) {
    for (const qual of shuffle(nivel.qualidades).slice(0, 4)) {
      const notas = notasDoAcorde(root, qual);
      const sym = simbolo(root, qual);
      const nome = `${root} ${NOMES_Q[qual] || qual}`;

      // Build wrong options from same level
      const wrongPool = nivel.qualidades
        .filter((wq) => wq !== qual)
        .flatMap((wq) => nivel.tonalidades.slice(0, 3).map((wr) => ({ r: wr, q: wq })))
        .filter((w) => simbolo(w.r, w.q) !== sym);

      // TYPE 1: See notes → pick chord name (multiple choice)
      const wrongNames = shuffle(wrongPool).slice(0, 3);
      const opts1: OpcaoResposta[] = shuffle([
        { id: 'c', texto: sym, ehCorreta: true },
        ...wrongNames.map((w, i) => ({
          id: `w${i}`, texto: simbolo(w.r, w.q), ehCorreta: false,
        })),
      ]);

      pool.push({
        id: uid(), moduloId: 'reconhecimento-visual', tipo: 'multipla-escolha',
        dificuldade: nivel.id as any,
        enunciado: `Notas: ${notas.join(' — ')}. Qual é o acorde?`,
        enunciadoDetalhe: `Identifique o acorde pelas notas destacadas`,
        opcoes: opts1, respostaCorreta: 'c',
        dica: `A raiz é ${root}. ${nivel.dicasGerais[0] || ''}`,
        explicacao: `${sym} = ${nome}. Notas: ${notas.join(', ')}.`,
        pontos: pts,
      });

      // TYPE 2: See name → pick correct notes
      const wrongNotes = shuffle(wrongPool).slice(0, 3);
      const opts2: OpcaoResposta[] = shuffle([
        { id: 'c', texto: notas.join(' — '), ehCorreta: true },
        ...wrongNotes.map((w, i) => ({
          id: `w${i}`, texto: notasDoAcorde(w.r, w.q).join(' — '), ehCorreta: false,
        })),
      ]);

      pool.push({
        id: uid(), moduloId: 'reconhecimento-visual', tipo: 'multipla-escolha',
        dificuldade: nivel.id as any,
        enunciado: `Quais são as notas de ${sym}?`,
        enunciadoDetalhe: nome,
        opcoes: opts2, respostaCorreta: 'c',
        dica: `${nome} tem ${notas.length} notas.`,
        explicacao: `${sym} = ${notas.join(', ')}. ${nome}.`,
        pontos: pts,
      });

      // TYPE 3: Typing (free input)
      pool.push({
        id: uid(), moduloId: 'reconhecimento-visual', tipo: 'digitacao',
        dificuldade: nivel.id as any,
        enunciado: `Notas: ${notas.join(' — ')}. Digite o nome do acorde:`,
        enunciadoDetalhe: 'Use formato: C, Cm, C7, Cmaj7...',
        respostaCorreta: sym,
        respostasAceitas: variantes(root, qual),
        dica: `A nota fundamental é ${root}. ${nivel.dicasGerais[0] || ''}`,
        explicacao: `${sym} = ${nome}. Notas: ${notas.join(', ')}.`,
        pontos: Math.round(pts * 1.5),
      });
    }
  }

  return shuffle(pool).slice(0, quantidade);
}
