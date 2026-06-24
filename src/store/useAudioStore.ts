import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AudioInstrumentId, PlaybackMode } from '@/lib/audio/audio-types';

interface AudioStore {
  currentInstrument: AudioInstrumentId;
  volume: number;
  muted: boolean;
  reverbAmount: number;
  playbackMode: PlaybackMode;
  arpeggioTempo: number;
  sustain: number;
  autoPlay: boolean;

  setInstrument: (id: AudioInstrumentId) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setMute: (muted: boolean) => void;
  setReverbAmount: (r: number) => void;
  setPlaybackMode: (m: PlaybackMode) => void;
  setArpeggioTempo: (t: number) => void;
  setSustain: (s: number) => void;
  setAutoPlay: (v: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      currentInstrument: 'piano-acoustic',
      volume: 0.75,
      muted: false,
      reverbAmount: 0.25,
      playbackMode: 'block',
      arpeggioTempo: 80,
      sustain: 2.5,
      autoPlay: false,

      setInstrument: (currentInstrument) => set({ currentInstrument }),
      setVolume: (volume) => set({ volume }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setMute: (muted) => set({ muted }),
      setReverbAmount: (reverbAmount) => set({ reverbAmount }),
      setPlaybackMode: (playbackMode) => set({ playbackMode }),
      setArpeggioTempo: (arpeggioTempo) => set({ arpeggioTempo }),
      setSustain: (sustain) => set({ sustain }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
    }),
    { name: 'musicverse-audio' }
  )
);
