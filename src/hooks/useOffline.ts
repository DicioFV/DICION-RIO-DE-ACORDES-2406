import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const [voltouOnline, setVoltouOnline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOffline = () => { setIsOffline(true); setVoltouOnline(false); };
    const handleOnline = () => { setIsOffline(false); setVoltouOnline(true); setTimeout(() => setVoltouOnline(false), 3000); };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => { window.removeEventListener('offline', handleOffline); window.removeEventListener('online', handleOnline); };
  }, []);

  return { isOffline, voltouOnline };
}
