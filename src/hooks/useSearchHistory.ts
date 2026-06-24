import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'musicverse-search-history';
const MAX_HISTORY = 12;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const add = useCallback((entry: string) => {
    const trimmed = entry.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((e) => e !== trimmed)].slice(
        0,
        MAX_HISTORY
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const remove = useCallback((entry: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e !== entry);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return { history, add, remove, clear };
}
