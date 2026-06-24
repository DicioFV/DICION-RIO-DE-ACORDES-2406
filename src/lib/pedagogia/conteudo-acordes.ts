/**
 * ============================================================
 * CONTEÚDO PEDAGÓGICO POR QUALIDADE DE ACORDE
 * 3 níveis: Iniciante / Intermediário / Avançado
 * ============================================================
 */

export interface ConteudoPedagogico {
  qualidade: string;
  iniciante: { oquee: string; comoSoa: string; ondeUsar: string[]; musicas: string[]; dicaMemorizacao: string };
  intermediario: { formula: string; intervalos: string[]; funcao: string; progressoes: string[]; substituicoes: string[] };
  avancado: { tensoes: string[]; voicings: string[]; rearmonizacao: string; analiseModal: string; exemplosJazz: string[] };
}

export const CONTEUDO_PEDAGOGICO: Record<string, ConteudoPedagogico> = {
  '': {
    qualidade: '',
    iniciante: { oquee: 'O acorde maior é o mais brilhante e estável. Quando dizem "toque um Dó", é Dó maior.', comoSoa: 'Brilhante, alegre, estável. "Música feliz".', ondeUsar: ['Acorde principal (I) da música', 'Final de frases para repouso', 'Sequências I-IV-V-I'], musicas: ['Happy Birthday', 'Let It Be', 'Imagine'], dicaMemorizacao: 'Maior = Alegre. 3 notas simples: fundamental + 3ª maior + 5ª justa.' },
    intermediario: { formula: '1 — 3M — 5J', intervalos: ['3ª maior (4 st) — define "maior"', '5ª justa (7 st) — estabilidade'], funcao: 'Tônica (I) ou Subdominante (IV)', progressoes: ['I-IV-V-I', 'I-VI-II-V', 'I-V-VI-IV'], substituicoes: ['Imaj7 adiciona cor sem mudar função', 'IIIm substitui (mesma função T)'] },
    avancado: { tensoes: ['9ª (add9)', '6ª (add6)', '#11 (Lídio)', '13ª'], voicings: ['Close: 1-3-5', 'Open: 1-5-8-3', 'Drop 2: redistribuído'], rearmonizacao: 'Substitua por Imaj7. Adicione #11 para Lídio. Evite I7 (a menos que queira blues).', analiseModal: 'Jônio (I). Com #11 = Lídio (IV).', exemplosJazz: ['Comping: use voicings sem 5ª (3-7-9-13)', 'Turnaround: Cmaj7-Em7-Am7-Dm7-G7'] },
  },
  'm': {
    qualidade: 'm',
    iniciante: { oquee: 'O acorde menor tem som introspectivo e melancólico. Muito usado em músicas emotivas.', comoSoa: 'Sombrio, melancólico, expressivo. Muito bonito e rico emocionalmente.', ondeUsar: ['Músicas emotivas', 'VI grau em progressões maiores', 'Tônica em tom menor'], musicas: ['Nothing Else Matters', 'Stairway to Heaven', 'Smells Like Teen Spirit'], dicaMemorizacao: 'Menor = Melancólico. Apenas 1 semitom de diferença do maior (3ª desce).' },
    intermediario: { formula: '1 — 3m — 5J', intervalos: ['3ª menor (3 st) — define "menor"', '5ª justa (7 st)'], funcao: 'Supertônica (II), Mediante (III) ou Superdominante (VI) em maior. Tônica (I) em menor.', progressoes: ['i-iv-V-i (cadência menor)', 'I-VI-IV-V', 'i-VII-VI-VII (rock)'], substituicoes: ['IIIm substitui I (mesma função T)', 'VIm substitui I (tônica relativa)'] },
    avancado: { tensoes: ['9ª (m9/madd9)', '11ª (m11)', '7ª maior (mMaj7 — caráter único)'], voicings: ['Rootless: 3-7-9-11', 'Quartal dórico: 1-4-7-10', 'Com 9ª: 1-3-5-9'], rearmonizacao: 'Adicione m7 e m9. Para tensão: m7b5 com baixo pedal. Para surpresa: mMaj7.', analiseModal: 'Eólio (VI). Com 6M: Dórico (II). Com 2m: Frígio (III).', exemplosJazz: ['Summertime: Am7 como tônica', 'So What: Dm7 modal por 16 compassos'] },
  },
  '7': {
    qualidade: '7',
    iniciante: { oquee: 'O dominante é o acorde mais tenso. Tem um trítono interno que cria tensão irresistível.', comoSoa: 'Tenso, quente, blues. "Empurra" para frente na música.', ondeUsar: ['Antes do acorde principal (V7→I)', 'Em todo blues', 'Para criar tensão antes de resolução'], musicas: ['Johnny B. Goode', 'Hound Dog', 'La Bamba'], dicaMemorizacao: 'G7 sempre quer ir para C. O dominante resolve! Acorde maior + Bb = C7.' },
    intermediario: { formula: '1 — 3M — 5J — 7m', intervalos: ['3M (4 st)', '7m (10 st) — cria tensão', 'Trítono: 3ª↔7ª'], funcao: 'DOMINANTE (V7). Toda tensão resolve no I.', progressoes: ['V7→I', 'II-V7-I', 'I7-IV-V7 (blues)'], substituicoes: ['SubV (trítono): Db7 substitui G7', 'Dim7: Bdim7 substitui G7b9', 'V7sus4 suaviza'] },
    avancado: { tensoes: ['b9 (frígio)', '#9 (Hendrix)', '#11 (Lídio dom.)', 'b13 (alterado)', '7alt (todas)'], voicings: ['Rootless: 3-7-9-13', 'Com b9: 7-3-b9-5', 'UST de Ab: G7+Ab = G7b9#5'], rearmonizacao: 'SubV (Db7), dims (Bdim7), V7sus4→V7, intercâmbio modal (V7b9 frígio).', analiseModal: 'Mixolídio (natural). b9/b13: Frígio dom. #11: Lídio dom. 7alt: escala alterada.', exemplosJazz: ['Autumn Leaves: F7→Bbmaj7', 'Com subV: Cm7-B7-Bbmaj7'] },
  },
  'maj7': {
    qualidade: 'maj7',
    iniciante: { oquee: 'O Maj7 tem som elegante e moderno. A 7ª maior cria uma cor especial — sofisticada.', comoSoa: 'Elegante, moderno, "cinematográfico". Favorito de compositores contemporâneos.', ondeUsar: ['Acorde I em músicas sofisticadas', 'Grau IV', 'Substituição do acorde maior simples'], musicas: ['Girl from Ipanema', 'Yesterday', 'What a Wonderful World'], dicaMemorizacao: 'Maj7 = acorde de luxo. Troque qualquer maior por Maj7 para mais sofisticação.' },
    intermediario: { formula: '1 — 3M — 5J — 7M', intervalos: ['3M (4 st)', '7M (11 st) — "coração" do Maj7', '7ª↔8ª: 1 semitom (tensão suave)'], funcao: 'Tônica (Imaj7) ou Subdominante (IVmaj7). Nunca dominante.', progressoes: ['Imaj7-IIm7-V7-Imaj7', 'IVmaj7-IIm7-V7-Imaj7'], substituicoes: ['Imaj7 substitui I sempre', '6/9 para som mais aberto'] },
    avancado: { tensoes: ['9ª (maj9)', '#11 (Lídio)', '13ª (maj13)', '6ª (6/9)'], voicings: ['Rootless: 3-7-9-13', 'Com #11: 7-3-#11-9 (lídio)', 'Spread: 1-5-7-3-9'], rearmonizacao: 'Adicione #11 para lídio. Use 6/9 para evitar tensão 7M↔8ª. Substitua por IIIm.', analiseModal: 'Imaj7 = Jônio. Imaj7#11 = Lídio. 6/9 evita tensão.', exemplosJazz: ['Autumn Leaves: Bbmaj7 como repouso', 'Misty: Ebmaj7 rootless'] },
  },
  'm7': {
    qualidade: 'm7',
    iniciante: { oquee: 'O menor com sétima adiciona suavidade ao acorde menor. Muito usado em jazz e bossa.', comoSoa: 'Suave, sofisticado, levemente melancólico. Som do jazz cool e bossa nova.', ondeUsar: ['Grau II no II-V-I do jazz', 'Tônica em tom menor suave', 'Progressões de bossa e MPB'], musicas: ['Girl from Ipanema', 'So What', 'Fly Me to the Moon'], dicaMemorizacao: 'Menor suavizado. A 7ª tira a "aspereza" do acorde menor puro.' },
    intermediario: { formula: '1 — 3m — 5J — 7m', intervalos: ['3m (3 st)', '7m (10 st) — suavidade', 'Sem trítono (≠ dom7)'], funcao: 'Subdominante (IIm7 no jazz) ou Tônica (Im7).', progressoes: ['IIm7-V7-Imaj7', 'Im7-IV7-I (funk)'], substituicoes: ['IIm7 pode ser substituído por IV', 'Im7 por bIII'] },
    avancado: { tensoes: ['9ª (m9)', '11ª (m11)', '13ª (cuidado — ambiguidade)'], voicings: ['Rootless: 3-7-9-5', 'Quartal dórico: 1-4-7-10-14', 'Com 11ª: 7-3-5-9-11'], rearmonizacao: 'Adicione 11ª para suavidade. No IIm7, cuidado para não confundir com m7b5.', analiseModal: 'Im7 = Eólio. IIm7 = Dórico (6ª maior = "cor" do IIm7 no jazz).', exemplosJazz: ['So What: Dm7 modal 16 compassos', 'Autumn Leaves: Am7 como IIm7 em G'] },
  },
  'dim': {
    qualidade: 'dim',
    iniciante: { oquee: 'Acorde diminuto — tenso e instável, sempre quer resolver para outro acorde.', comoSoa: 'Tenso, dramático, instável. Som de suspense em filmes.', ondeUsar: ['Acorde de passagem (C→Cdim→Dm)', 'VIIº que resolve na tônica', 'Tensão dramática'], musicas: ['Temas de suspense', 'Ragtime', 'Acordes de passagem no gospel'], dicaMemorizacao: 'DIMinutO = tudo menor (3ª menor E 5ª menor). Sobe 3, sobe 3!' },
    intermediario: { formula: '1 — 3m — 5d (trítono)', intervalos: ['3m (3 st)', '5d = trítono (6 st)'], funcao: 'Dominante fraca (VIIº). Resolve como V7.', progressoes: ['I-Idim-IIm (passagem)', 'VIIdim-I', 'IIdim-V7-I'], substituicoes: ['Bdim substitui G7', 'Cdim substitui A7 (dom. sec. do IIm)'] },
    avancado: { tensoes: ['Raramente recebe extensões — prefira dim7'], voicings: ['Fundamental: 1-3-5 compacto'], rearmonizacao: 'Use como passagem cromática. Qualquer dim pode ser dim7 (simétrico).', analiseModal: 'VII da escala maior. II da menor harmônica.', exemplosJazz: ['C→C#dim→Dm7 (cromático)'] },
  },
};

export function getConteudoPedagogico(qualidade: string): ConteudoPedagogico | null {
  return CONTEUDO_PEDAGOGICO[qualidade] || null;
}
