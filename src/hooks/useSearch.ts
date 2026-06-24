import { useEffect, useState } from 'react';
import { search, autocomplete } from '@/lib/search/search-engine';
import type { SearchFilters, SearchResponse, SearchResult } from '@/lib/search/search-types';
import { useDebounce } from './useDebounce';

export interface UseSearchOptions {
  initialQuery?: string;
  filters?: SearchFilters;
  debounceMs?: number;
  mode?: 'autocomplete' | 'full';
  limit?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    initialQuery = '',
    filters,
    debounceMs = 120,
    mode = 'autocomplete',
    limit = 8,
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounce(query, debounceMs);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!debounced.trim()) {
      setResponse(null);
      return;
    }

    setIsSearching(true);

    // Execução síncrona (motor in-memory)
    try {
      if (mode === 'autocomplete') {
        const results = autocomplete(debounced, limit);
        setResponse({
          query: {
            raw: debounced,
            normalized: debounced,
            tokens: [],
            detectedMode: 'symbol',
          },
          results,
          totalFound: results.length,
          durationMs: 0,
        });
      } else {
        setResponse(search(debounced, { filters, limit }));
      }
    } finally {
      setIsSearching(false);
    }
  }, [debounced, mode, limit, filters]);

  const results: SearchResult[] = response?.results ?? [];

  return {
    query,
    setQuery,
    results,
    response,
    isSearching,
    clear: () => setQuery(''),
  };
}
