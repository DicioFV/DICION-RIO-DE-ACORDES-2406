/**
 * ============================================================
 * INTERNAL LINKING SYSTEM
 * ============================================================
 */
import { NOME_NOTA_PT, NOME_QUALIDADE_PT } from './sitemap-builder';

const NOTAS = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

export interface LinkInterno {
  href: string;
  texto: string;
  descricao: string;
  tipo: 'relacionado' | 'mesmo-tipo' | 'campo' | 'exercicio';
}

const RELACIONADOS: Record<string, string[]> = {
  '': ['maj7', 'add9', '6', 'sus4'], 'm': ['m7', 'm9', 'dim'],
  '7': ['9', '7b9', '7#9', '7alt'], 'maj7': ['maj9', '6'], 'm7': ['m9', 'm7b5'],
  'dim': ['dim7', 'm7b5'], '9': ['7', 'maj9', '13'], 'dim7': ['m7b5', '7b9'],
};

export function gerarLinksRelacionados(nota: string, qualidade: string, limite = 8): LinkInterno[] {
  const links: LinkInterno[] = [];
  const rels = RELACIONADOS[qualidade] || [];

  // Same root, related qualities
  for (const q of rels.slice(0, 3)) {
    const sym = `${nota}${q}`;
    links.push({ href: `#/acorde/${nota.toLowerCase()}-${q || 'maior'}`, texto: sym, descricao: `${NOME_NOTA_PT[nota] || nota} ${NOME_QUALIDADE_PT[q] || q}`, tipo: 'relacionado' });
  }

  // Same quality, nearby keys (5th above/below)
  const idx = NOTAS.indexOf(nota);
  for (const offset of [7, 5]) {
    const n = NOTAS[(idx + offset) % 12];
    const sym = `${n}${qualidade}`;
    links.push({ href: `#/acorde/${n.toLowerCase()}-${qualidade || 'maior'}`, texto: sym, descricao: `${NOME_NOTA_PT[n] || n} ${NOME_QUALIDADE_PT[qualidade] || qualidade}`, tipo: 'mesmo-tipo' });
  }

  links.push({ href: '#/exercicios', texto: 'Praticar', descricao: 'Exercícios de reconhecimento', tipo: 'exercicio' });

  return links.slice(0, limite);
}
