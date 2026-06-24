import { useState, useCallback, useEffect } from 'react';

type NivelPedagogico = 'iniciante' | 'intermediario' | 'avancado';
const CHAVE = 'musicverse:nivel-pedagogico';

export function usePedagogia() {
  const [nivelAtual, setNivelAtual] = useState<NivelPedagogico>('iniciante');

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE) as NivelPedagogico | null;
      if (salvo && ['iniciante', 'intermediario', 'avancado'].includes(salvo)) setNivelAtual(salvo);
    } catch { /* ignore */ }
  }, []);

  const salvarNivel = useCallback((nivel: NivelPedagogico) => {
    setNivelAtual(nivel);
    try { localStorage.setItem(CHAVE, nivel); } catch { /* ignore */ }
  }, []);

  return { nivelAtual, salvarNivel };
}
