import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InstrumentId } from '@/config/instruments';

interface AppState {
  currentInstrument: InstrumentId;
  audioEnabled: boolean;
  theme: 'light' | 'dark';
  setInstrument: (id: InstrumentId) => void;
  toggleAudio: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentInstrument: 'piano',
      audioEnabled: true,
      theme: 'dark',
      setInstrument: (id) => set({ currentInstrument: id }),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'musicverse-app' }
  )
);
