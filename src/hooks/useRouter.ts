import { useState, useEffect, useCallback } from 'react';

/**
 * Simple hash-based router for SPA
 * Routes: #/ #/piano #/guitarra #/audio #/dicionario #/acorde/:slug #/teoria #/sobre
 */
export function useRouter() {
  const [path, setPath] = useState(() => getHashPath());

  useEffect(() => {
    const handler = () => setPath(getHashPath());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // Parse route segments
  const segments = path.split('/').filter(Boolean);
  const route = segments[0] || 'home';
  const param = segments[1] || null;

  return { path, route, param, segments, navigate, goBack };
}

function getHashPath(): string {
  const hash = window.location.hash.slice(1) || '/';
  return hash.startsWith('/') ? hash : '/' + hash;
}

/**
 * Navigate helper (can be used outside React)
 */
export function navigateTo(path: string) {
  window.location.hash = path;
}
