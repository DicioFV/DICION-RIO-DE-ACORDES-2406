/**
 * ============================================================
 * SCHEMA.ORG GENERATORS (JSON-LD)
 * ============================================================
 */
import { NOME_NOTA_PT, NOME_QUALIDADE_PT } from './sitemap-builder';

const SITE_URL = 'https://musicversechords.com.br';
const SITE_NAME = 'MusicVerse Chords';

export function schemaAcorde(p: { nota: string; qualidade: string; simbolo: string; notas: string[]; descricao: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'MusicComposition',
    name: `Acorde ${p.simbolo} — ${NOME_NOTA_PT[p.nota] || p.nota} ${NOME_QUALIDADE_PT[p.qualidade] || p.qualidade}`,
    description: p.descricao, inLanguage: 'pt-BR', isAccessibleForFree: true,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export function schemaHowTo(p: { simbolo: string; notas: string[] }) {
  return {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: `Como tocar o acorde ${p.simbolo}`,
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Identifique as notas', text: `Notas: ${p.notas.join(', ')}` },
      { '@type': 'HowToStep', position: 2, name: 'Posicione os dedos', text: 'Posicione nos instrumentos.' },
      { '@type': 'HowToStep', position: 3, name: 'Toque e ouça', text: 'Use o botão de áudio.' },
      { '@type': 'HowToStep', position: 4, name: 'Pratique inversões', text: 'Explore as inversões.' },
    ],
    totalTime: 'PT5M',
  };
}

export function schemaFAQ(p: { simbolo: string; nota: string; qualidade: string; notas: string[] }) {
  const nomeNota = NOME_NOTA_PT[p.nota] || p.nota;
  const nomeQual = NOME_QUALIDADE_PT[p.qualidade] || p.qualidade;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Quais são as notas de ${p.simbolo}?`, acceptedAnswer: { '@type': 'Answer', text: `${p.simbolo} = ${p.notas.join(', ')}.` } },
      { '@type': 'Question', name: `O que significa ${p.simbolo}?`, acceptedAnswer: { '@type': 'Answer', text: `${nomeNota} ${nomeQual}.` } },
      { '@type': 'Question', name: `Como tocar ${p.simbolo} no piano?`, acceptedAnswer: { '@type': 'Answer', text: `Pressione ${p.notas.join(', ')} simultaneamente.` } },
    ],
  };
}

export function schemaBreadcrumb(items: { nome: string; url: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.nome, item: `${SITE_URL}${item.url}` })),
  };
}

export const schemaOrganization = {
  '@context': 'https://schema.org', '@type': 'Organization',
  name: SITE_NAME, url: SITE_URL, description: 'O maior dicionário de acordes do Brasil.',
};

export const schemaWebSite = {
  '@context': 'https://schema.org', '@type': 'WebSite',
  name: SITE_NAME, url: SITE_URL, inLanguage: 'pt-BR',
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/#/dicionario?busca={search_term_string}` }, 'query-input': 'required name=search_term_string' },
};
