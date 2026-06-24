/**
 * ============================================================
 * FUZZY MATCHER — Tolerância inteligente a digitação
 *
 * Implementa distância de Levenshtein + heurísticas musicais
 * ============================================================
 */

/**
 * Distância de Levenshtein (edição mínima)
 */
export function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deleção
        matrix[i][j - 1] + 1, // inserção
        matrix[i - 1][j - 1] + cost // substituição
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Similaridade normalizada (0 a 1)
 */
export function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Verifica se `query` é prefixo aproximado de `target`
 */
export function fuzzyPrefixMatch(
  query: string,
  target: string,
  threshold = 0.7
): boolean {
  if (target.toLowerCase().startsWith(query.toLowerCase())) return true;
  if (query.length < 2) return false;

  const prefix = target.substring(0, query.length);
  return similarity(query.toLowerCase(), prefix.toLowerCase()) >= threshold;
}

/**
 * Verifica se `query` contém `target` ou vice-versa, com tolerância
 */
export function fuzzyContains(
  query: string,
  target: string,
  threshold = 0.75
): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t.includes(q) || q.includes(t)) return true;

  return similarity(q, t) >= threshold;
}

/**
 * Calcula score de match considerando posição do match
 * Matches no início são mais relevantes
 */
export function positionalScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Match exato
  if (t === q) return 1.0;

  // Começa com a query
  if (t.startsWith(q)) {
    return 0.9 + (q.length / t.length) * 0.1;
  }

  // Contém a query
  const idx = t.indexOf(q);
  if (idx >= 0) {
    const positionPenalty = idx / t.length;
    return 0.7 - positionPenalty * 0.2;
  }

  // Similaridade fuzzy
  return similarity(q, t) * 0.5;
}
