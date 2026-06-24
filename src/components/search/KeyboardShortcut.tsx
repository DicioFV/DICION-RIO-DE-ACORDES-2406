import { useEffect } from 'react';

/**
 * Captura atalho global "/" para focar na busca da página
 */
export function KeyboardShortcut() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          'input[aria-label="Buscar acorde"]'
        );
        input?.focus();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return null;
}
