import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'musicverse-chord-favorites';

export function useFavoritesChords() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const persist = useCallback((list: string[]) => {
    setFavorites(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggle = useCallback((chordId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(chordId)
        ? prev.filter((id) => id !== chordId)
        : [...prev, chordId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const add = useCallback((chordId: string) => {
    setFavorites((prev) => {
      if (prev.includes(chordId)) return prev;
      const next = [...prev, chordId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const remove = useCallback((chordId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((id) => id !== chordId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (chordId: string) => favorites.includes(chordId),
    [favorites]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return { favorites, toggle, add, remove, isFavorite, clear };
}
