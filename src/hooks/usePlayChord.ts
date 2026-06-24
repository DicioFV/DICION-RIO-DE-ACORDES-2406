import { useCallback, useState } from 'react';
import type { Chord } from '@/lib/music-theory/types';
import { playChord, playNote } from '@/lib/audio/playback-modes';
import { loadSampler } from '@/lib/audio/audio-engine';
import { useAudioStore } from '@/store/useAudioStore';
import { trackEvent } from '@/lib/analytics';

interface UsePlayChordOptions {
  voicing?: string;
  inversion?: number;
  baseOctave?: number;
}

export function usePlayChord(options: UsePlayChordOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentInstrument = useAudioStore((s) => s.currentInstrument);
  const playbackMode = useAudioStore((s) => s.playbackMode);
  const arpeggioTempo = useAudioStore((s) => s.arpeggioTempo);
  const sustain = useAudioStore((s) => s.sustain);
  const muted = useAudioStore((s) => s.muted);

  const play = useCallback(
    async (chord: Chord) => {
      if (muted || isPlaying) return;

      setIsLoading(true);
      try {
        await loadSampler(currentInstrument);
        setIsLoading(false);
        setIsPlaying(true);

        await playChord({
          chord,
          instrument: currentInstrument,
          voicing: options.voicing,
          inversion: options.inversion,
          baseOctave: options.baseOctave,
          config: {
            mode: playbackMode,
            tempo: arpeggioTempo,
            sustain,
            velocity: 0.8,
          },
          onComplete: () => setIsPlaying(false),
        });

        trackEvent('chord_played', {
          symbol: chord.symbol,
          instrument: currentInstrument,
          mode: playbackMode,
        });
      } catch (err) {
        console.error('Erro ao tocar acorde:', err);
        setIsPlaying(false);
        setIsLoading(false);
      }
    },
    [
      currentInstrument,
      playbackMode,
      arpeggioTempo,
      sustain,
      muted,
      isPlaying,
      options.voicing,
      options.inversion,
      options.baseOctave,
    ]
  );

  const playSingleNote = useCallback(
    async (midi: number) => {
      if (muted) return;
      try {
        await playNote(midi, currentInstrument, 1, 0.7);
      } catch (err) {
        console.error('Erro ao tocar nota:', err);
      }
    },
    [currentInstrument, muted]
  );

  return { play, playSingleNote, isPlaying, isLoading };
}
