import { useAudioStore } from '@/store/useAudioStore';
import { useAudioInit } from './useAudioInit';
import { usePlayChord } from './usePlayChord';

/**
 * Convenience hook combining audio init, store, and playback
 */
export function useAudio(
  options: { voicing?: string; inversion?: number; baseOctave?: number } = {}
) {
  const ready = useAudioInit();
  const store = useAudioStore();
  const player = usePlayChord(options);

  return {
    ready,
    ...store,
    ...player,
  };
}
