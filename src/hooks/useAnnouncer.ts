import { useCallback, useEffect, useRef } from 'react';

/**
 * ARIA live region announcer for screen readers
 */
export function useAnnouncer() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    div.className = 'sr-only';
    div.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    document.body.appendChild(div);
    ref.current = div;
    return () => { div.remove(); };
  }, []);

  const announce = useCallback((message: string) => {
    if (!ref.current) return;
    ref.current.textContent = '';
    requestAnimationFrame(() => { if (ref.current) ref.current.textContent = message; });
  }, []);

  return { announce };
}
