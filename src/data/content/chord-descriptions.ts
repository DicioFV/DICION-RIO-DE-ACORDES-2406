import type { ChordCategory } from '@/lib/music-theory/types';

/**
 * ============================================================
 * CONTEÚDO PEDAGÓGICO POR CATEGORIA E COMPLEXIDADE
 * ============================================================
 */

/**
 * Descrição curta por qualidade (frase única)
 */
export const QUALITY_SHORT_DESCRIPTIONS: Record<string, string> = {
  'maj': 'Acorde maior — som alegre, brilhante, estável.',
  'min': 'Acorde menor — som triste, melancólico, introspectivo.',
  'dim': 'Acorde diminuto — som tenso, instável, pede resolução.',
  'aug': 'Acorde aumentado — som misterioso, suspenso, etéreo.',
  'sus2': 'Acorde suspenso na segunda — som aberto, neutro, contemplativo.',
  'sus4': 'Acorde suspenso na quarta — som de tensão suave, anseio de resolução.',
  'power': 'Power chord — som potente, neutro, base do rock.',
  '6': 'Acorde com sexta — som doce, vintage, característico do jazz e bossa.',
  'm6': 'Menor com sexta — som elegante, sofisticado, jazzístico.',
  '6/9': 'Sexta com nona — som rico, moderno, comum em finais de música.',
  '7': 'Sétima dominante — som tenso, pede resolução. Base do blues.',
  'maj7': 'Sétima maior — som sofisticado, etéreo, característico do jazz e bossa nova.',
  'm7': 'Menor com sétima — som suave, contemplativo, presente em jazz e MPB.',
  'mMaj7': 'Menor com sétima maior — som sombrio, dramático, cinematográfico.',
  'm7b5': 'Meio diminuto — som tenso, comum em progressões menores (ii em tonalidade menor).',
  'dim7': 'Diminuto com sétima — som de máxima tensão, simétrico, usado como passagem.',
  'aug7': 'Aumentado com sétima — som ambíguo, comum em dominantes alterados.',
  'augMaj7': 'Aumentado com sétima maior — som etéreo, impressionista.',
  '7sus4': 'Sétima suspensa — som moderno, evita a terça, comum em pop e gospel.',
  'add9': 'Add 9 — som luminoso, brilhante, sem a complicação da sétima.',
  'madd9': 'Menor add 9 — som introspectivo e moderno.',
  'add11': 'Add 11 — som suspenso, aberto, característico do pop moderno.',
  '9': 'Nona dominante — som rico, soul, funk, gospel.',
  'maj9': 'Nona maior — som sofisticado, jazzístico, lounge.',
  'm9': 'Menor nona — som suave e expansivo, neo-soul.',
  '11': 'Décima-primeira dominante — som suspenso e moderno.',
  'maj11': 'Décima-primeira maior — som expansivo, característico de jazz contemporâneo.',
  'm11': 'Menor décima-primeira — som denso, característico de neo-soul.',
  '13': 'Décima-terceira dominante — som rico e completo, alto teor de sofisticação.',
  'maj13': 'Décima-terceira maior — som etéreo e completo.',
  'm13': 'Menor décima-terceira — som denso, sofisticado.',
  '7b5': 'Sétima com quinta bemol — som tenso, comum em dominantes alterados.',
  '7#5': 'Sétima com quinta sustenida — som tenso, jazzístico.',
  '7b9': 'Sétima com nona bemol — som tenso e exótico, comum em dominantes para menores.',
  '7#9': 'Sétima com nona sustenida — o famoso "acorde de Hendrix", funk e rock.',
  '7#11': 'Sétima com décima-primeira sustenida — som lídio dominante.',
  '7b13': 'Sétima com décima-terceira bemol — som tenso, escala mixolídia b13.',
  '7alt': 'Dominante alterado — máxima tensão, jazz moderno.',
  '9b5': 'Nona com quinta bemol — som tenso e colorido.',
  '13b9': 'Décima-terceira com nona bemol — som extremamente colorido.',
  '13#11': 'Décima-terceira com décima-primeira sustenida — pura sofisticação lídia.',
};

/**
 * Estilos musicais por categoria
 */
export const STYLES_BY_CATEGORY: Record<ChordCategory, string[]> = {
  'triad': ['popular', 'rock', 'folk', 'gospel', 'sertanejo'],
  'seventh': ['jazz', 'blues', 'bossa-nova', 'gospel', 'pop'],
  'extended': ['jazz', 'neo-soul', 'gospel', 'mpb', 'bossa-nova'],
  'altered': ['jazz', 'fusion', 'be-bop'],
  'suspended': ['pop', 'rock', 'gospel', 'worship'],
  'added': ['pop', 'rock', 'indie', 'gospel'],
  'sixth': ['jazz', 'bossa-nova', 'mpb', 'gospel'],
  'diminished': ['jazz', 'choro', 'samba'],
  'augmented': ['jazz', 'impressionismo', 'cinematic'],
  'power': ['rock', 'metal', 'punk'],
  'slash': ['pop', 'gospel', 'mpb', 'piano-solo'],
  'polychord': ['jazz', 'modern', 'fusion'],
};

/**
 * Descrições por categoria
 */
export const CATEGORY_DESCRIPTIONS: Record<ChordCategory, string> = {
  'triad': 'Acordes de três notas — a base de toda harmonia ocidental.',
  'seventh': 'Acordes com sétima — mais coloridos e expressivos que as tríades.',
  'extended': 'Acordes estendidos com 9ª, 11ª ou 13ª — sofisticação harmônica.',
  'altered': 'Acordes com notas alteradas — tensão máxima, jazz avançado.',
  'suspended': 'Acordes suspensos — sem terça, som aberto e neutro.',
  'added': 'Acordes com nota adicionada — colorido sem complexidade da sétima.',
  'sixth': 'Acordes de sexta — som vintage e elegante.',
  'diminished': 'Acordes diminutos — instabilidade e tensão.',
  'augmented': 'Acordes aumentados — mistério e suspense.',
  'power': 'Power chords — potência sem definição maior/menor.',
  'slash': 'Slash chords — inversões e baixos alternativos.',
  'polychord': 'Poliacordes — dois acordes sobrepostos.',
};

/**
 * Traduz categoria para português
 */
export function translateCategory(category: ChordCategory): string {
  const map: Record<ChordCategory, string> = {
    'triad': 'Tríades',
    'seventh': 'Tétrades de Sétima',
    'extended': 'Acordes Estendidos',
    'altered': 'Acordes Alterados',
    'suspended': 'Acordes Suspensos',
    'added': 'Acordes com Nota Agregada',
    'sixth': 'Acordes de Sexta',
    'diminished': 'Acordes Diminutos',
    'augmented': 'Acordes Aumentados',
    'power': 'Power Chords',
    'slash': 'Slash Chords',
    'polychord': 'Poliacordes',
  };
  return map[category] || category;
}

/**
 * Traduz complexidade para português
 */
export function translateComplexity(complexity: string): string {
  const map: Record<string, string> = {
    'beginner': 'Iniciante',
    'basic': 'Básico',
    'intermediate': 'Intermediário',
    'advanced': 'Avançado',
    'master': 'Mestre',
  };
  return map[complexity] || complexity;
}

/**
 * Gera exemplos de uso por qualidade
 */
export function getUsageExamples(qualityId: string): string[] {
  const examples: Record<string, string[]> = {
    'maj': [
      'Acorde de repouso em tonalidades maiores',
      'Primeiro e último acorde da maioria das músicas populares',
    ],
    'min': [
      'Acorde de repouso em tonalidades menores',
      'Expressão de melancolia e introspecção',
    ],
    'maj7': [
      'Início e final de músicas em tonalidade maior — som de "casa"',
      'Substituição moderna para o acorde maior simples (I → Imaj7)',
    ],
    '7': [
      'Acorde dominante — V grau preparando resolução para a tônica',
      'Base do blues — toda progressão blues parte do dominante',
    ],
    'm7': [
      'Acorde de ii grau em progressões ii-V-I',
      'Vi grau em tonalidades maiores (substituto da tônica)',
    ],
    '7#9': [
      '"Purple Haze" de Jimi Hendrix — riff icônico',
      'Funk e soul — base de grooves coloridos',
    ],
    'dim7': [
      'Acorde de passagem cromática',
      'Dominante substituto (vii° em vez de V7)',
    ],
    'm7b5': [
      'ii grau em tonalidades menores',
      'Preparação para dominantes alterados',
    ],
  };

  return examples[qualityId] || [];
}
