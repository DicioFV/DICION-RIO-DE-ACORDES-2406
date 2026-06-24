import { useAudioStore } from '@/store/useAudioStore';
import { PLAYBACK_MODE_LABELS, getPlayableModes } from '@/lib/audio/playback-modes';

export function PlaybackModeSelector() {
  const { playbackMode, setPlaybackMode } = useAudioStore();
  const modes = getPlayableModes();

  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
        Modo de reprodução
      </div>
      <div className="flex flex-wrap gap-1.5">
        {modes.map((mode) => {
          const info = PLAYBACK_MODE_LABELS[mode];
          const active = playbackMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setPlaybackMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
              title={info.description}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
