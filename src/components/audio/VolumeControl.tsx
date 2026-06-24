import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';
import { setMasterVolume, setMasterMute } from '@/lib/audio/audio-engine';

export function VolumeControl({ className }: { className?: string }) {
  const { volume, muted, setVolume, toggleMute } = useAudioStore();

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setMasterVolume(v);
  };

  const handleToggleMute = () => {
    toggleMute();
    setMasterMute(!muted);
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <button
        onClick={handleToggleMute}
        className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-muted transition cursor-pointer"
        aria-label={muted ? 'Desmutar' : 'Mutar'}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        disabled={muted}
        className="w-24 accent-primary"
        aria-label="Volume"
      />
      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
