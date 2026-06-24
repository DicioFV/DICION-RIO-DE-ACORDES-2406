import { create } from 'zustand';
import type { SearchFilters } from '@/lib/search/search-types';

interface SearchStore {
  isOpen: boolean;
  filters: SearchFilters;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setFilters: (f: SearchFilters) => void;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  filters: {},
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((s) => ({
      filters: { ...s.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: {} }),
}));
