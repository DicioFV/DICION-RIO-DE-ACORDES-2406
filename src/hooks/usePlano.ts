/**
 * Hook for user plan state (localStorage-based for SPA)
 * In production, this would be backed by JWT/session
 */
import { useState, useEffect, useCallback } from 'react';
import type { PlanoId } from '@/lib/planos/config';

const CHAVE = 'musicverse:plano-usuario';

export function usePlano() {
  const [plano, setPlanoState] = useState<PlanoId>('gratis');

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE) as PlanoId | null;
      if (salvo) setPlanoState(salvo);
    } catch { /* ignore */ }
  }, []);

  const setPlano = useCallback((p: PlanoId) => {
    setPlanoState(p);
    try { localStorage.setItem(CHAVE, p); } catch { /* ignore */ }
  }, []);

  return { plano, setPlano };
}
