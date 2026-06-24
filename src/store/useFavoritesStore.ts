import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) =>
        set((s) => ({ favorites: [...s.favorites, id] })),
      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f !== id) })),
      isFavorite: (id) => get().favorites.includes(id),
      toggleFavorite: (id) => {
        const state = get();
        if (state.favorites.includes(id)) {
          state.removeFavorite(id);
        } else {
          state.addFavorite(id);
        }
      },
    }),
    { name: 'musicverse-favorites' }
  )
);
