/**
 * ============================================================
 * ESTATÍSTICAS POR TIPO DE INTERVALO
 * ============================================================
 */
import { INTERVALOS_DATABASE } from './database';

const CHAVE = 'musicverse:stats-intervalos';

interface DadoIntervalo {
  total: number;
  acertos: number;
  tempoTotal: number;
  ultimos: Array<{ ok: boolean; t: number }>;
}

export function registrarResultadoIntervalo(id: string, acertou: boolean, tempoMs: number): void {
  try {
    const stats = JSON.parse(localStorage.getItem(CHAVE) || '{}') as Record<string, DadoIntervalo>;
    const atual = stats[id] || { total: 0, acertos: 0, tempoTotal: 0, ultimos: [] };
    atual.total++;
    if (acertou) atual.acertos++;
    atual.tempoTotal += tempoMs;
    atual.ultimos.push({ ok: acertou, t: tempoMs });
    if (atual.ultimos.length > 30) atual.ultimos.shift();
    stats[id] = atual;
    localStorage.setItem(CHAVE, JSON.stringify(stats));
  } catch { /* ignore */ }
}

export interface EstatIntervalo {
  id: string;
  nome: string;
  abrev: string;
  cor: string;
  total: number;
  acertos: number;
  precisao: number;
  tendencia: 'up' | 'down' | 'stable';
}

export function obterEstatisticas(): EstatIntervalo[] {
  let stats: Record<string, DadoIntervalo> = {};
  try { stats = JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { /* ignore */ }

  return INTERVALOS_DATABASE.map((iv) => {
    const d = stats[iv.id];
    if (!d || d.total === 0) {
      return { id: iv.id, nome: iv.nome, abrev: iv.nomeAbreviado, cor: iv.corHex, total: 0, acertos: 0, precisao: 0, tendencia: 'stable' as const };
    }
    const precisao = Math.round((d.acertos / d.total) * 100);

    // Trend from last entries
    let tendencia: 'up' | 'down' | 'stable' = 'stable';
    if (d.ultimos.length >= 6) {
      const half = Math.floor(d.ultimos.length / 2);
      const first = d.ultimos.slice(0, half).filter((u) => u.ok).length / half;
      const second = d.ultimos.slice(half).filter((u) => u.ok).length / (d.ultimos.length - half);
      if (second - first > 0.1) tendencia = 'up';
      else if (first - second > 0.1) tendencia = 'down';
    }

    return { id: iv.id, nome: iv.nome, abrev: iv.nomeAbreviado, cor: iv.corHex, total: d.total, acertos: d.acertos, precisao, tendencia };
  });
}
