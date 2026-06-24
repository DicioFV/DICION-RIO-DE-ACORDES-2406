import { useAudioStore } from '@/store/useAudioStore';
import { VolumeControl } from './VolumeControl';
import { PlaybackModeSelector } from './PlaybackModeSelector';
import {
  getPresetCategories,
  getCategoryLabel,
  getPresetsByCategory,
} from '@/lib/audio/audio-presets';

export function AudioControls({ className }: { className?: string }) {
  const {
    currentInstrument,
    arpeggioTempo,
    sustain,
    setInstrument,
    setArpeggioTempo,
    setSustain,
  } = useAudioStore();

  const categories = getPresetCategories();

  return (
    <div
      className={`p-4 rounded-xl border border-border bg-card space-y-4 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">🔊 Controles de Áudio</h3>
        <VolumeControl />
      </div>

      <PlaybackModeSelector />

      {/* Timbre Selector */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Timbre
        </div>
        <div className="space-y-2">
          {categories.map((cat) => {
            const presets = getPresetsByCategory(cat);
            return (
              <div key={cat}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {getCategoryLabel(cat)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setInstrument(p.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                        currentInstrument === p.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
            Velocidade ({arpeggioTempo}ms)
          </label>
          <input
            type="range"
            min={30}
            max={250}
            value={arpeggioTempo}
            onChange={(e) => setArpeggioTempo(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">
            Sustain ({sustain.toFixed(1)}s)
          </label>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={sustain}
            onChange={(e) => setSustain(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
