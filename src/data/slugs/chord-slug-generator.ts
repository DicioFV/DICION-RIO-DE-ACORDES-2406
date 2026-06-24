import { ALL_KEYS } from '../keys/all-keys';

/**
 * ============================================================
 * GERADOR DE SLUGS SEO-FRIENDLY (PORTUGUÊS)
 * ============================================================
 */

/**
 * Mapeia qualidade para nome PT-BR usado em URLs
 */
const QUALITY_SLUG_MAP: Record<string, string> = {
  'maj': 'maior',
  'min': 'menor',
  'dim': 'diminuto',
  'aug': 'aumentado',
  'sus2': 'sus2',
  'sus4': 'sus4',
  'power': 'power',
  '6': 'sexta',
  'm6': 'menor-sexta',
  '6/9': 'sexta-nona',
  '7': 'setima',
  'maj7': 'maior-setima',
  'm7': 'menor-setima',
  'mMaj7': 'menor-setima-maior',
  'm7b5': 'meio-diminuto',
  'dim7': 'diminuto-setima',
  'aug7': 'aumentado-setima',
  'augMaj7': 'aumentado-setima-maior',
  '7sus4': 'setima-sus4',
  'add9': 'add9',
  'madd9': 'menor-add9',
  'add11': 'add11',
  '9': 'nona',
  'maj9': 'maior-nona',
  'm9': 'menor-nona',
  '11': 'decima-primeira',
  'maj11': 'maior-decima-primeira',
  'm11': 'menor-decima-primeira',
  '13': 'decima-terceira',
  'maj13': 'maior-decima-terceira',
  'm13': 'menor-decima-terceira',
  '7b5': 'setima-quinta-bemol',
  '7#5': 'setima-quinta-sustenida',
  '7b9': 'setima-nona-bemol',
  '7#9': 'setima-nona-sustenida',
  '7#11': 'setima-decima-primeira-sustenida',
  '7b13': 'setima-decima-terceira-bemol',
  '7alt': 'setima-alterado',
  '9b5': 'nona-quinta-bemol',
  '13b9': 'decima-terceira-nona-bemol',
  '13#11': 'decima-terceira-decima-primeira-sustenida',
};

/**
 * Slugify básico
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Gera slug PT-BR para acorde
 * Ex: ('C', 'maj7') → "do-maior-setima"
 * Ex: ('F#', 'm7') → "fa-sustenido-menor-setima"
 */
export function generateChordSlug(
  rootName: string,
  qualityId: string,
  bassName?: string
): string {
  const key = ALL_KEYS.find((k) => k.name === rootName);
  if (!key) {
    // Fallback para notas não mapeadas
    const sanitizedRoot = rootName.toLowerCase().replace('#', '-sustenido').replace('b', '-bemol');
    const qualitySlug = QUALITY_SLUG_MAP[qualityId] || slugify(qualityId);
    return `${sanitizedRoot}-${qualitySlug}`;
  }

  const qualitySlug = QUALITY_SLUG_MAP[qualityId] || slugify(qualityId);
  let slug = `${key.slug}-${qualitySlug}`;

  if (bassName) {
    const bassKey = ALL_KEYS.find((k) => k.name === bassName);
    if (bassKey) {
      slug += `-baixo-${bassKey.slug}`;
    } else {
      const sanitizedBass = bassName.toLowerCase().replace('#', '-sustenido').replace('b', '-bemol');
      slug += `-baixo-${sanitizedBass}`;
    }
  }

  return slug;
}

/**
 * Gera nome de exibição PT-BR
 * Ex: ('C', 'Sétima Maior') → "Dó Sétima Maior"
 */
export function generateDisplayName(
  rootName: string,
  qualityName: string,
  bassName?: string
): string {
  const key = ALL_KEYS.find((k) => k.name === rootName);
  const rootDisplay = key?.displayName || rootName;

  let display = `${rootDisplay} ${qualityName}`;

  if (bassName) {
    const bassKey = ALL_KEYS.find((k) => k.name === bassName);
    const bassDisplay = bassKey?.displayName || bassName;
    display += ` com baixo em ${bassDisplay}`;
  }

  return display;
}

/**
 * Gera ID único kebab-case
 * Ex: ('C', 'maj7') → "c-maj7"
 * Ex: ('F#', 'm7b5') → "fsharp-m7b5"
 */
export function generateChordId(
  rootName: string,
  qualityId: string,
  bassName?: string
): string {
  const sanitize = (s: string) =>
    s
      .toLowerCase()
      .replace(/#/g, 'sharp')
      .replace(/b(?!$)/g, 'flat') // b no meio vira flat
      .replace(/\//, '-');

  let id = `${sanitize(rootName)}-${qualityId.toLowerCase().replace(/[#/]/g, '')}`;

  if (bassName) {
    id += `-over-${sanitize(bassName)}`;
  }

  // Remove caracteres problemáticos
  id = id.replace(/[^a-z0-9-]/g, '');

  return id;
}

/**
 * Gera alternativas de símbolo
 */
export function generateSymbolAlternatives(
  rootName: string,
  aliases: string[]
): string[] {
  return aliases.map((alias) => `${rootName}${alias}`);
}
