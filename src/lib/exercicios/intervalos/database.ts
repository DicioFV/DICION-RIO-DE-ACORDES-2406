/**
 * ============================================================
 * BANCO DOS 13 INTERVALOS MUSICAIS
 * ============================================================
 */

export interface Intervalo {
  id: string;
  semitons: number;
  nome: string;
  nomeAbreviado: string;
  tipo: 'consonante' | 'dissonante' | 'perfeito';
  categoria: string;
  acordesComuns: string[];
  mnemonico: { ascendente: string; descendente?: string };
  corHex: string;
  descricao: string;
  curiosidade: string;
}

export const INTERVALOS_DATABASE: Intervalo[] = [
  { id: 'unissono', semitons: 0, nome: 'Uníssono', nomeAbreviado: '1J', tipo: 'perfeito', categoria: 'unissono',
    acordesComuns: ['M', 'm'], mnemonico: { ascendente: 'Mesma nota' },
    corHex: '#64748b', descricao: 'Duas notas iguais. 0 semitons.', curiosidade: 'O ponto de partida de toda harmonia.' },
  { id: 'segunda-menor', semitons: 1, nome: '2ª menor', nomeAbreviado: '2m', tipo: 'dissonante', categoria: 'segunda',
    acordesComuns: ['7b9', '13b9'], mnemonico: { ascendente: 'Tema do Tubarão (Jaws)', descendente: 'Für Elise' },
    corHex: '#dc2626', descricao: 'O semitom cromático. Máxima dissonância.', curiosidade: 'Intervalo da "nota sensível" — Si→Dó.' },
  { id: 'segunda-maior', semitons: 2, nome: '2ª maior', nomeAbreviado: '2M', tipo: 'dissonante', categoria: 'segunda',
    acordesComuns: ['sus2', 'add9', '9'], mnemonico: { ascendente: 'Parabéns a Você', descendente: 'Yesterday (Beatles)' },
    corHex: '#f97316', descricao: 'O tom inteiro. Base da escala diatônica.', curiosidade: 'O intervalo mais comum nas melodias.' },
  { id: 'terca-menor', semitons: 3, nome: '3ª menor', nomeAbreviado: '3m', tipo: 'consonante', categoria: 'terca',
    acordesComuns: ['m', 'm7', 'dim'], mnemonico: { ascendente: 'Smoke on the Water', descendente: 'Hey Jude' },
    corHex: '#f59e0b', descricao: 'Define o som "menor" e melancólico.', curiosidade: 'Presente em todo acorde menor ou diminuto.' },
  { id: 'terca-maior', semitons: 4, nome: '3ª maior', nomeAbreviado: '3M', tipo: 'consonante', categoria: 'terca',
    acordesComuns: ['M', 'maj7', '7', 'aug'], mnemonico: { ascendente: 'Oh When the Saints', descendente: 'Summertime' },
    corHex: '#eab308', descricao: 'Define o som "maior" e brilhante.', curiosidade: 'O intervalo mais consonante após oitava e quinta.' },
  { id: 'quarta-justa', semitons: 5, nome: '4ª justa', nomeAbreviado: '4J', tipo: 'perfeito', categoria: 'quarta',
    acordesComuns: ['sus4', '7sus4'], mnemonico: { ascendente: 'Amazing Grace', descendente: 'Born to Run' },
    corHex: '#84cc16', descricao: 'Inversão da 5ª justa. Base da harmonia quartal.', curiosidade: 'Era dissonante na Idade Média, hoje é consonante.' },
  { id: 'tritono', semitons: 6, nome: 'Trítono', nomeAbreviado: 'TT', tipo: 'dissonante', categoria: 'tritono',
    acordesComuns: ['7', 'dim7', 'm7b5'], mnemonico: { ascendente: 'Os Simpsons (tema)', descendente: 'Maria (West Side Story)' },
    corHex: '#991b1b', descricao: 'Metade exata da oitava. Máxima tensão.', curiosidade: '"Diabolus in musica" — proibido na Idade Média.' },
  { id: 'quinta-justa', semitons: 7, nome: '5ª justa', nomeAbreviado: '5J', tipo: 'perfeito', categoria: 'quinta',
    acordesComuns: ['M', 'm', '5', '7', 'maj7'], mnemonico: { ascendente: 'Star Wars (tema)', descendente: 'Flintstones' },
    corHex: '#16a34a', descricao: 'O mais consonante após a oitava. Base de toda harmonia tonal.', curiosidade: 'O círculo de quintas é a estrutura mais importante da teoria.' },
  { id: 'sexta-menor', semitons: 8, nome: '6ª menor', nomeAbreviado: '6m', tipo: 'consonante', categoria: 'sexta',
    acordesComuns: ['m6', 'aug'], mnemonico: { ascendente: 'In My Life (Beatles)', descendente: 'Love Story (tema)' },
    corHex: '#0d9488', descricao: 'Inversão da 3ª maior. Som expressivo.', curiosidade: 'O intervalo mais "romântico" da música de cinema.' },
  { id: 'sexta-maior', semitons: 9, nome: '6ª maior', nomeAbreviado: '6M', tipo: 'consonante', categoria: 'sexta',
    acordesComuns: ['6', 'm7', '6/9'], mnemonico: { ascendente: 'My Bonnie Lies Over the Ocean' },
    corHex: '#0891b2', descricao: 'Inversão da 3ª menor. Som aberto.', curiosidade: 'Muito usada em solos de blues e jazz.' },
  { id: 'setima-menor', semitons: 10, nome: '7ª menor', nomeAbreviado: '7m', tipo: 'dissonante', categoria: 'setima',
    acordesComuns: ['7', 'm7', '9', '11', '13'], mnemonico: { ascendente: 'Somewhere (West Side Story)' },
    corHex: '#2563eb', descricao: 'Transforma tríade em dominante. Base do blues.', curiosidade: 'Chamada de "sétima dominante" com a 3ª maior.' },
  { id: 'setima-maior', semitons: 11, nome: '7ª maior', nomeAbreviado: '7M', tipo: 'dissonante', categoria: 'setima',
    acordesComuns: ['maj7', 'mMaj7', 'maj9'], mnemonico: { ascendente: 'Take On Me (A-ha)' },
    corHex: '#4f46e5', descricao: 'Som elegante do acorde maj7. A 1 semitom da oitava.', curiosidade: 'Bossa nova e jazz modal adoram o Maj7.' },
  { id: 'oitava', semitons: 12, nome: 'Oitava', nomeAbreviado: '8J', tipo: 'perfeito', categoria: 'oitava',
    acordesComuns: ['M', 'm', '7'], mnemonico: { ascendente: 'Somewhere Over the Rainbow' },
    corHex: '#7c3aed', descricao: 'Mesma nota, frequência dobrada. Máxima consonância.', curiosidade: 'Duas notas a uma oitava soam quase iguais.' },
];

export const INTERVALOS_POR_SEMITONS = Object.fromEntries(INTERVALOS_DATABASE.map((i) => [i.semitons, i]));
export const NOTAS_CROMATICAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function calcularNotaAlvo(raiz: string, semitons: number): string {
  const idx = NOTAS_CROMATICAS.indexOf(raiz);
  if (idx < 0) return raiz;
  return NOTAS_CROMATICAS[(idx + semitons) % 12];
}

export function calcularSemitons(n1: string, n2: string): number {
  const i1 = NOTAS_CROMATICAS.indexOf(n1);
  const i2 = NOTAS_CROMATICAS.indexOf(n2);
  if (i1 < 0 || i2 < 0) return 0;
  return (i2 - i1 + 12) % 12;
}

export const NOME_TIPO: Record<string, string> = {
  'perfeito': '🔵 Perfeito', 'consonante': '🟢 Consonante', 'dissonante': '🔴 Dissonante',
};
