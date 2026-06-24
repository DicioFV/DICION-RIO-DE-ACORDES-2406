/**
 * ============================================================
 * DYNAMIC HEAD MANAGER (for SPA)
 * Updates document title, meta tags, and JSON-LD on route changes
 * ============================================================
 */

export function updateHead(params: {
  title: string;
  description: string;
  keywords?: string[];
  schemas?: Record<string, unknown>[];
}) {
  // Title
  document.title = `${params.title} | MusicVerse Chords`;

  // Meta description
  setMeta('description', params.description);

  // Keywords
  if (params.keywords?.length) {
    setMeta('keywords', params.keywords.join(', '));
  }

  // OG tags
  setMeta('og:title', params.title, 'property');
  setMeta('og:description', params.description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('twitter:title', params.title, 'name');
  setMeta('twitter:description', params.description, 'name');

  // JSON-LD schemas
  if (params.schemas?.length) {
    // Remove old schemas
    document.querySelectorAll('script[data-seo="musicverse"]').forEach((el) => el.remove());
    
    for (const schema of params.schemas) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = 'musicverse';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Generate SEO data for a chord page
 */
export function chordSEO(symbol: string, displayName: string, notes: string[], _qualityName: string) {
  return {
    title: `Acorde ${symbol} — ${displayName}`,
    description: `Aprenda o acorde ${symbol} (${displayName}). Notas: ${notes.join(', ')}. Para piano, violão, guitarra, ukulele e mais. Interativo com áudio.`,
    keywords: [
      `acorde ${symbol}`, `${symbol} piano`, `${symbol} violão`, `como tocar ${symbol}`,
      displayName.toLowerCase(), `${symbol} notas`, `${symbol} diagrama`,
    ],
  };
}

/**
 * Generate SEO data for tonality page
 */
export function tonalitySEO(nota: string, displayName: string, count: number) {
  return {
    title: `Acordes de ${displayName} (${nota})`,
    description: `Todos os ${count} acordes de ${displayName}: ${nota}, ${nota}m, ${nota}7, ${nota}maj7 e mais. Para piano, violão e outros instrumentos.`,
    keywords: [`acordes de ${displayName.toLowerCase()}`, `${nota} maior`, `${nota} menor`, `${nota}7`],
  };
}

/**
 * Generate SEO data for notes page
 */
export function noteSEO(symbol: string, displayName: string) {
  return {
    title: `Nota ${displayName} (${symbol})`,
    description: `Tudo sobre a nota ${displayName}: frequência em Hz, posição no piano e violão, enarmonia e acordes relacionados.`,
    keywords: [`nota ${displayName.toLowerCase()}`, `${symbol} frequência`, `${symbol} piano`],
  };
}
