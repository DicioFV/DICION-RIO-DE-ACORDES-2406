import { useEffect, useState } from 'react';
import { initAudioEngine, isAudioInitialized, setMasterVolume, setMasterMute } from '@/lib/audio/audio-engine';
import { useAudioStore } from '@/store/useAudioStore';

/**
 * Initializes the audio engine after user's first gesture
 * (required by browsers for autoplay)
 */
export function useAudioInit() {
  const [ready, setReady] = useState(isAudioInitialized());
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);

  useEffect(() => {
    if (ready) return;

    const handler = async () => {
      try {
        await initAudioEngine();
        setReady(true);
        // Apply saved settings
        setMasterVolume(volume);
        setMasterMute(muted);
      } catch (err) {
        console.error('Erro ao inicializar áudio:', err);
      }
    };

    const events = ['click', 'keydown', 'touchstart'] as const;
    events.forEach((e) =>
      document.addEventListener(e, handler, { once: true, passive: true })
    );

    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
    };
  }, [ready, volume, muted]);

  return ready;
}
