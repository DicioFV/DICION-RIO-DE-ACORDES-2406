/**
 * ============================================================
 * NORMALIZADOR DE INPUTS
 *
 * Converte qualquer variação de input em forma canônica.
 *
 * Exemplos:
 * "C maj 7" → "Cmaj7"
 * "DÓ M7" → "Cmaj7"
 * "F#min" → "F#m"
 * "Sol7" → "G7"
 * "C Maj 7" → "Cmaj7"
 * ============================================================
 */

/**
 * Mapa de notas em português → notação universal
 */
const PT_TO_UNIVERSAL: Record<string, string> = {
  'do': 'C',
  'dó': 'C',
  're': 'D',
  'ré': 'D',
  'mi': 'E',
  'fa': 'F',
  'fá': 'F',
  'sol': 'G',
  'la': 'A',
  'lá': 'A',
  'si': 'B',
};

/**
 * Mapa de qualidades em português
 */
const QUALITY_PT_MAP: Record<string, string> = {
  'maior': '',
  'menor': 'm',
  'aumentado': 'aug',
  'diminuto': 'dim',
  'sus2': 'sus2',
  'sus4': 'sus4',
  'sus': 'sus4',
  'setima': '7',
  'sétima': '7',
  'nona': '9',
  'decima primeira': '11',
  'décima primeira': '11',
  'decima terceira': '13',
  'décima terceira': '13',
};

/**
 * Mapa de símbolos exóticos → ASCII
 */
const SYMBOL_MAP: Record<string, string> = {
  'Δ': 'maj',
  '∆': 'maj',
  'ø': 'm7b5',
  '°': 'dim',
  '+': 'aug',
  '−': '-',
  '–': '-',
  '—': '-',
};

/**
 * Normaliza um input de busca
 */
export function normalizeQuery(input: string): string {
  if (!input) return '';

  let s = input
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim();

  // Substitui símbolos exóticos
  for (const [sym, repl] of Object.entries(SYMBOL_MAP)) {
    s = s.split(sym).join(repl);
  }

  // Substitui notas em português (palavra inteira)
  for (const [pt, en] of Object.entries(PT_TO_UNIVERSAL)) {
    const regex = new RegExp(`\\b${pt}\\b`, 'gi');
    s = s.replace(regex, en);
  }

  // Substitui qualidades em português
  for (const [pt, en] of Object.entries(QUALITY_PT_MAP)) {
    const regex = new RegExp(`\\b${pt}\\b`, 'gi');
    s = s.replace(regex, en);
  }

  // Variações comuns de "major"
  s = s
    .replace(/major/gi, 'maj')
    .replace(/minor/gi, 'm')
    .replace(/min(?!o)/gi, 'm'); // min but not mino

  // Remove espaços internos
  s = s.replace(/\s+/g, '');

  // Primeira letra maiúscula (notas A-G)
  s = s.replace(/^[a-g]/, (m) => m.toUpperCase());

  // Trata "#" e "b" após a nota
  s = s.replace(/^([A-G])\s*#/, '$1#').replace(/^([A-G])\s*b/, '$1b');

  return s;
}

/**
 * Detecta se input parece ser uma lista de notas
 * Ex: "C E G", "do mi sol", "C, E, G"
 */
export function looksLikeNoteList(input: string): boolean {
  const cleaned = input.trim().toLowerCase();

  // Padrão: 2+ notas separadas por espaço, vírgula ou hífen
  const notePattern = /^([a-g](#|b)?[\s,;-]+){1,}[a-g](#|b)?$/i;
  const ptPattern = /^(do|re|mi|fa|sol|la|si)([#b])?(\s+(do|re|mi|fa|sol|la|si)([#b])?){1,}$/i;

  return notePattern.test(cleaned) || ptPattern.test(cleaned);
}

/**
 * Detecta se input pergunta por função harmônica
 * Ex: "dominante de Sol", "V de C", "tonica de F"
 */
export function looksLikeFunctionQuery(input: string): boolean {
  const lower = input.toLowerCase();
  return (
    /\b(dominante|tônica|tonica|subdominante|grau)\s+(de|do|em)\b/.test(lower) ||
    /^[ivx]+\s+(de|em)\s+/i.test(lower)
  );
}

/**
 * Extrai notas de uma string
 */
export function extractNotes(input: string): string[] {
  // Primeiro normaliza português para inglês
  let normalized = input.toLowerCase();
  
  for (const [pt, en] of Object.entries(PT_TO_UNIVERSAL)) {
    const regex = new RegExp(`\\b${pt}\\b`, 'gi');
    normalized = normalized.replace(regex, en);
  }

  // Extrai notas (A-G com opcionais # ou b)
  const matches = normalized.match(/[A-Ga-g](#|b)?/g) || [];
  
  // Capitaliza primeira letra
  return matches.map(n => n.charAt(0).toUpperCase() + n.slice(1));
}

/**
 * Normaliza um nome de nota para comparação
 */
export function normalizeNoteName(note: string): string {
  return note.trim().toUpperCase().replace(/♯/g, '#').replace(/♭/g, 'b');
}
