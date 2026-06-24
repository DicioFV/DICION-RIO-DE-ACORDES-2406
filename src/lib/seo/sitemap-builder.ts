/**
 * ============================================================
 * SITEMAP BUILDER & URL SYSTEM
 * ============================================================
 */

export const NOTAS_CROMATICAS_SEO = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

export const SLUG_NOTA: Record<string, string> = {
  'C': 'do', 'Db': 'do-sustenido', 'D': 're', 'Eb': 're-sustenido', 'E': 'mi',
  'F': 'fa', 'F#': 'fa-sustenido', 'G': 'sol', 'Ab': 'sol-sustenido', 'A': 'la',
  'Bb': 'la-sustenido', 'B': 'si',
};

export const SLUG_QUALIDADE: Record<string, string> = {
  '': 'maior', 'm': 'menor', 'dim': 'diminuto', 'aug': 'aumentado',
  'sus2': 'sus2', 'sus4': 'sus4', '7': 'setima', 'm7': 'menor-setima',
  'maj7': 'maior-setima', 'm7b5': 'meio-diminuto', 'dim7': 'dim-setima',
  '9': 'nona', 'm9': 'menor-nona', 'maj9': 'maior-nona', 'add9': 'add9',
  '11': 'decima-primeira', '13': 'decima-terceira', '7b9': 'setima-nona-bemol',
  '7#9': 'setima-nona-sustenido', '7alt': 'alterado',
};

export const NOME_NOTA_PT: Record<string, string> = {
  'C': 'Dó', 'Db': 'Dó#/Réb', 'D': 'Ré', 'Eb': 'Ré#/Mib', 'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá#/Solb', 'G': 'Sol', 'Ab': 'Sol#/Láb', 'A': 'Lá',
  'Bb': 'Lá#/Sib', 'B': 'Si',
};

export const NOME_QUALIDADE_PT: Record<string, string> = {
  '': 'Maior', 'm': 'Menor', 'dim': 'Diminuto', 'aug': 'Aumentado',
  'sus2': 'Sus2', 'sus4': 'Sus4', '7': 'Sétima Dominante',
  'm7': 'Menor com Sétima', 'maj7': 'Maior com Sétima Maior',
  'm7b5': 'Meio Diminuto', 'dim7': 'Diminuto com Sétima',
  '9': 'Nona', 'm9': 'Menor Nona', 'maj9': 'Maior Nona', 'add9': 'Add9',
  '11': 'Décima Primeira', '13': 'Décima Terceira',
  '7b9': 'Sétima Nona Bemol', '7#9': 'Sétima Nona Sustenido', '7alt': 'Alterado',
};

export function gerarUrlAcorde(nota: string, qualidade: string): string {
  return `#/acorde/${SLUG_NOTA[nota] || nota.toLowerCase()}-${SLUG_QUALIDADE[qualidade] || qualidade.toLowerCase()}`;
}

export function gerarUrlTonalidade(nota: string): string {
  return `#/dicionario-tonalidade/${SLUG_NOTA[nota] || nota.toLowerCase()}`;
}
