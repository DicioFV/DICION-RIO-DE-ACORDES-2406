import { useEffect, useState } from 'react';

/**
 * Debounce hook - delays updating a value until after a specified delay
 */
export function useDebounce<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
