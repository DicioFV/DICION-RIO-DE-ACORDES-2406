/**
 * ============================================================
 * BANCO DE DADOS DAS 12 NOTAS CROMÁTICAS
 * ============================================================
 */

export interface NotaCromatica {
  id: string;
  simbolo: string;
  simboloPortugues: string;
  slug: string;
  enarmonia: string | null;
  enarmoniaPt: string | null;
  enarmoniaSimbolo: string | null;
  posicaoCromatica: number;
  tipo: 'natural' | 'sustenido' | 'bemol';
  teclaTipo: 'branca' | 'preta';
  descricao: string;
  curiosidade: string;
  usoComum: string[];
}

export const NOTAS_DATABASE: NotaCromatica[] = [
  {
    id: 'C', simbolo: 'C', simboloPortugues: 'Dó', slug: 'do',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 0, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Dó (C) é o ponto de partida da música ocidental. É a nota central do teclado de piano e a base de toda teoria musical moderna.',
    curiosidade: 'A nota Dó central (C4 = 261,63 Hz) fica exatamente no meio do piano de 88 teclas.',
    usoComum: ['Tônica de Dó maior (tom mais ensinado)', 'Base da escala sem alterações', 'Referência para sopros'],
  },
  {
    id: 'Db', simbolo: 'C#/Db', simboloPortugues: 'Dó# / Réb', slug: 'do-sustenido',
    enarmonia: 'C#', enarmoniaPt: 'Dó sustenido', enarmoniaSimbolo: 'C#',
    posicaoCromatica: 1, tipo: 'sustenido', teclaTipo: 'preta',
    descricao: 'Dó sustenido (C#) ou Ré bemol (Db) — mesmo som, nomes diferentes dependendo do contexto harmônico.',
    curiosidade: 'C# maior tem 7 sustenidos; Db maior tem 5 bemóis. Enharmonicamente idênticos.',
    usoComum: ['Tonalidade de Réb maior (gospel, jazz)', 'Nota sensível em Ré maior'],
  },
  {
    id: 'D', simbolo: 'D', simboloPortugues: 'Ré', slug: 're',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 2, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Ré (D) é uma das notas mais usadas no violão, sendo corda solta na maioria das afinações.',
    curiosidade: 'D4 (293,66 Hz) é a nota mais frequente em composições para flauta e violino.',
    usoComum: ['Corda solta no violão (4ª corda)', 'Tônica de Ré maior (sertanejo)', 'Afinação do bandolim'],
  },
  {
    id: 'Eb', simbolo: 'D#/Eb', simboloPortugues: 'Ré# / Mib', slug: 're-sustenido',
    enarmonia: 'D#', enarmoniaPt: 'Ré sustenido', enarmoniaSimbolo: 'D#',
    posicaoCromatica: 3, tipo: 'bemol', teclaTipo: 'preta',
    descricao: 'Mi bemol (Eb) é extremamente popular no jazz e na música gospel.',
    curiosidade: 'Miles Davis gravou "Kind of Blue" baseado em escalas modais a partir de Eb.',
    usoComum: ['Tonalidade de Mib maior (jazz, gospel)', 'Terça de Dó menor', 'Instrumentos transpostos'],
  },
  {
    id: 'E', simbolo: 'E', simboloPortugues: 'Mi', slug: 'mi',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 4, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Mi (E) é a nota mais grave e mais aguda do violão em afinação padrão.',
    curiosidade: 'E2 e E4 são as cordas 6 e 1 do violão. Mi menor é relativa de Sol maior.',
    usoComum: ['1ª e 6ª cordas do violão', 'Tônica de Mi maior/menor (rock, blues)', 'Trítono de Bb7'],
  },
  {
    id: 'F', simbolo: 'F', simboloPortugues: 'Fá', slug: 'fa',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 5, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Fá (F) é o subdominante de Dó maior — uma das funções mais importantes da harmonia tonal.',
    curiosidade: 'F foi a primeira nota a receber um bemol na história da notação musical.',
    usoComum: ['Subdominante de Dó maior', 'Tônica de Fá maior (1 bemol)', 'Acorde com pestana no violão'],
  },
  {
    id: 'F#', simbolo: 'F#/Gb', simboloPortugues: 'Fá# / Solb', slug: 'fa-sustenido',
    enarmonia: 'Gb', enarmoniaPt: 'Sol bemol', enarmoniaSimbolo: 'Gb',
    posicaoCromatica: 6, tipo: 'sustenido', teclaTipo: 'preta',
    descricao: 'Fá# (F#) ou Solb (Gb) formam o trítono de Dó — a nota mais distante no círculo das quintas.',
    curiosidade: 'O intervalo C-F# é o "diabolus in musica" — o trítono proibido na Idade Média.',
    usoComum: ['Trítono de Dó', 'Nota de tensão máxima', 'Tônica de Fá# maior (6 sustenidos)'],
  },
  {
    id: 'G', simbolo: 'G', simboloPortugues: 'Sol', slug: 'sol',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 7, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Sol (G) é uma das notas mais naturais para a voz humana e violão. A clave de Sol recebe esse nome por circundar G na pauta.',
    curiosidade: 'A clave de Sol (𝄞) era uma letra "G" estilizada que indicava onde ficava o Sol.',
    usoComum: ['Corda solta no violão (3ª corda)', 'Tônica de Sol maior (1 sustenido)', 'Tom clássico do samba'],
  },
  {
    id: 'Ab', simbolo: 'G#/Ab', simboloPortugues: 'Sol# / Láb', slug: 'sol-sustenido',
    enarmonia: 'G#', enarmoniaPt: 'Sol sustenido', enarmoniaSimbolo: 'G#',
    posicaoCromatica: 8, tipo: 'bemol', teclaTipo: 'preta',
    descricao: 'Lá bemol (Ab) é muito usada em música gospel, jazz e MPB.',
    curiosidade: 'Ab maior tem 4 bemóis. Tonalidade favorita de Chopin e Schubert.',
    usoComum: ['Terça de Fá menor', 'Tonalidade de Láb maior (gospel)', 'Blue note no blues em Mi'],
  },
  {
    id: 'A', simbolo: 'A', simboloPortugues: 'Lá', slug: 'la',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 9, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Lá (A) é a nota de referência universal: A4 = 440 Hz, o padrão internacional de afinação.',
    curiosidade: 'A4 = 440 Hz é o padrão desde 1939, definido pela ISO. Antes cada orquestra usava sua própria referência.',
    usoComum: ['Nota de afinação universal (440 Hz)', '5ª corda do violão (solta)', 'Tônica de Lá menor (relativa de Dó)'],
  },
  {
    id: 'Bb', simbolo: 'A#/Bb', simboloPortugues: 'Lá# / Sib', slug: 'la-sustenido',
    enarmonia: 'A#', enarmoniaPt: 'Lá sustenido', enarmoniaSimbolo: 'A#',
    posicaoCromatica: 10, tipo: 'bemol', teclaTipo: 'preta',
    descricao: 'Si bemol (Bb) é a tonalidade natural de trompetes, clarinetas e saxofones soprano.',
    curiosidade: 'A maioria dos sopros de banda é "em Sib" — quando tocam Dó, soa Sib.',
    usoComum: ['Tonalidade natural de trompetes', 'Dominante de Mib maior', 'Tônica de Sib maior (jazz, funk)'],
  },
  {
    id: 'B', simbolo: 'B', simboloPortugues: 'Si', slug: 'si',
    enarmonia: null, enarmoniaPt: null, enarmoniaSimbolo: null,
    posicaoCromatica: 11, tipo: 'natural', teclaTipo: 'branca',
    descricao: 'Si (B) é a última nota da escala cromática antes de retornar ao Dó. É a sensível de Dó maior.',
    curiosidade: 'Si é a "nota sensível" de Dó maior — a meio tom da tônica, criando forte tensão harmônica.',
    usoComum: ['Sensível de Dó maior', '2ª corda do violão (solta)', 'Tônica de Si maior (5 sustenidos)'],
  },
];

export const NOTAS_POR_SLUG = Object.fromEntries(NOTAS_DATABASE.map((n) => [n.slug, n]));
export const NOTAS_POR_ID = Object.fromEntries(NOTAS_DATABASE.map((n) => [n.id, n]));
export const TODOS_SLUGS_NOTAS = NOTAS_DATABASE.map((n) => n.slug);
