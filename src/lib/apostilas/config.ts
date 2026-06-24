/**
 * ============================================================
 * 12 APOSTILAS DE LUXO — CONFIGURAÇÃO
 * ============================================================
 */

export interface NivelApostila {
  id: string; numero: number; titulo: string; subtitulo: string; emoji: string;
  paginas: number; cor: string; planMinimo: 'gratis' | 'pro' | 'master' | 'premium';
  descricao: string; topicos: string[]; acordesExemplo: string[];
}

export const APOSTILAS: NivelApostila[] = [
  { id: 'nivel-01', numero: 1, titulo: 'Fundamentos Musicais', subtitulo: 'A base de toda harmonia', emoji: '🌱', paginas: 40, cor: 'from-emerald-500 to-green-600', planMinimo: 'gratis',
    descricao: 'Notas, semitons, claves, ritmo e introdução ao teclado.', topicos: ['12 notas cromáticas', 'Semitons e tons', 'Clave de Sol e Fá', 'Compasso simples', 'Leitura básica'], acordesExemplo: ['C', 'G', 'F'] },
  { id: 'nivel-02', numero: 2, titulo: 'Tríades Essenciais', subtitulo: 'Os blocos fundamentais', emoji: '🎹', paginas: 60, cor: 'from-blue-500 to-indigo-600', planMinimo: 'gratis',
    descricao: 'Maiores, menores, diminutas e aumentadas em 12 tonalidades.', topicos: ['Tríade maior', 'Tríade menor', 'Diminuta e aumentada', 'As 12 tonalidades', 'Progressões I-IV-V'], acordesExemplo: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'] },
  { id: 'nivel-03', numero: 3, titulo: 'Campo Harmônico Maior', subtitulo: 'Os 7 graus e funções', emoji: '🎼', paginas: 80, cor: 'from-violet-500 to-purple-600', planMinimo: 'pro',
    descricao: 'Funções T/SD/D, cadências e harmonização de melodias.', topicos: ['7 graus do campo', 'Tônica, Subdominante, Dominante', 'Cadências', 'Harmonização de melodias'], acordesExemplo: ['Cmaj7', 'Dm7', 'G7', 'Am7'] },
  { id: 'nivel-04', numero: 4, titulo: 'Tétrades e Sétimas', subtitulo: 'Acordes de 4 notas', emoji: '🎵', paginas: 90, cor: 'from-amber-500 to-orange-600', planMinimo: 'pro',
    descricao: 'Maj7, m7, dom7, m7b5, dim7 e mMaj7 com aplicações.', topicos: ['Maj7', 'm7', 'Dominante 7', 'm7b5', 'dim7', 'II-V-I'], acordesExemplo: ['Cmaj7', 'Dm7', 'G7', 'Bm7b5'] },
  { id: 'nivel-05', numero: 5, titulo: 'Campo Harmônico Menor', subtitulo: 'Natural, harmônico e melódico', emoji: '🎶', paginas: 100, cor: 'from-indigo-500 to-blue-600', planMinimo: 'pro',
    descricao: 'Três escalas menores, modos Dórico e Frígio.', topicos: ['Menor natural', 'Menor harmônica', 'Menor melódica', 'Modo Dórico', 'Modo Frígio'], acordesExemplo: ['Am', 'Dm', 'E7'] },
  { id: 'nivel-06', numero: 6, titulo: 'Voicings e Inversões', subtitulo: 'Distribuição das notas', emoji: '🎸', paginas: 120, cor: 'from-pink-500 to-rose-600', planMinimo: 'master',
    descricao: 'Close, open, drop 2/3, inversões em todos os acordes.', topicos: ['Inversões 1ª, 2ª, 3ª', 'Close position', 'Drop 2 e Drop 3', 'Voicings por instrumento'], acordesExemplo: ['Cmaj7', 'G7', 'Dm7'] },
  { id: 'nivel-07', numero: 7, titulo: 'Acordes Estendidos', subtitulo: '9ª, 11ª e 13ª', emoji: '🎷', paginas: 140, cor: 'from-teal-500 to-cyan-600', planMinimo: 'master',
    descricao: 'Extensões naturais, add, sus e 6/9 no jazz e gospel.', topicos: ['9ª natural', '#11 e Lídio', '13ª', 'add9, sus2, sus4', '6/9', 'Rootless voicings'], acordesExemplo: ['Cmaj9', 'Dm9', 'G13', 'C6/9'] },
  { id: 'nivel-08', numero: 8, titulo: 'Acordes Alterados', subtitulo: 'Tensões cromáticas', emoji: '🎺', paginas: 160, cor: 'from-red-500 to-rose-600', planMinimo: 'master',
    descricao: '7b5, 7#5, 7b9, 7#9, 7#11, 7alt e escalas correspondentes.', topicos: ['7b5', '7#5', '7b9 (Frígio dom.)', '7#9 (Hendrix)', '7#11 (Lídio dom.)', '7alt', 'Escala Alterada'], acordesExemplo: ['G7b9', 'G7#9', 'G7alt'] },
  { id: 'nivel-09', numero: 9, titulo: 'Rearmonização', subtitulo: 'Recriar harmonias', emoji: '🎤', paginas: 180, cor: 'from-orange-500 to-amber-600', planMinimo: 'premium',
    descricao: 'SubV, dominantes secundários, modal interchange e análise.', topicos: ['Dominantes secundários', 'Substituição do trítono', 'Intercâmbio modal', 'Análise de standards'], acordesExemplo: ['G7', 'Db7', 'A7'] },
  { id: 'nivel-10', numero: 10, titulo: 'Voicings Profissionais', subtitulo: 'Rootless, UST, quartal', emoji: '🎹', paginas: 200, cor: 'from-purple-500 to-violet-600', planMinimo: 'premium',
    descricao: 'Upper Structure Triads, harmonia quartal e Barry Harris.', topicos: ['Rootless A e B', 'Upper Structure Triads', 'Harmonia quartal', 'Barry Harris', 'Neo-soul voicings'], acordesExemplo: ['Cmaj9', 'G7alt', 'Dm11'] },
  { id: 'nivel-11', numero: 11, titulo: 'Estilos Aplicados', subtitulo: 'Jazz, bossa, gospel, MPB, fusion', emoji: '🎼', paginas: 220, cor: 'from-sky-500 to-blue-600', planMinimo: 'premium',
    descricao: 'Métodos harmônicos de 6 gêneros com análise de standards.', topicos: ['Jazz: bebop e modal', 'Bossa Nova', 'Gospel', 'MPB', 'Fusion', 'Neo-soul'], acordesExemplo: ['Dm7', 'G7', 'Cmaj7'] },
  { id: 'nivel-12', numero: 12, titulo: 'Mestre da Harmonia', subtitulo: 'Poliacordes e composição', emoji: '👑', paginas: 260, cor: 'from-yellow-500 to-amber-600', planMinimo: 'premium',
    descricao: 'Poliacordes, harmonia negativa e composição avançada.', topicos: ['Poliacordes', 'Harmonia negativa', 'Neo-Riemanniana', 'Análise: Kind of Blue', 'Projeto de composição'], acordesExemplo: ['F#/C', 'Bb/C', 'Db7'] },
];

export const TOTAL_PAGINAS = APOSTILAS.reduce((s, a) => s + a.paginas, 0);
