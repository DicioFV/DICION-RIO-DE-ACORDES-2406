import { useState, useEffect, useCallback } from 'react';

export function usePwa() {
  const [podeInstalar, setPodeInstalar] = useState(false);
  const [instalado, setInstalado] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(ios);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setInstalado(isStandalone);
    if (ios && !isStandalone) setPodeInstalar(true);

    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); setPodeInstalar(true); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalado(true); setPodeInstalar(false); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const instalar = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { setInstalado(true); setPodeInstalar(false); }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dispensar = useCallback(() => {
    setPodeInstalar(false);
    try { localStorage.setItem('pwa-dismissed', Date.now().toString()); } catch {}
  }, []);

  return { podeInstalar, instalado, isIOS, instalar, dispensar };
}
