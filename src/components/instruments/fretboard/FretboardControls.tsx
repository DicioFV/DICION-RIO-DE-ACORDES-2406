import { ChevronLeft, ChevronRight } from 'lucide-react';
import type {
  FretboardConfig,
  FretboardInstrument,
  FretboardView,
  FretboardDisplay,
  FretboardOrientation,
  ChordShape,
  Tuning,
} from '@/lib/fretboard/fretboard-types';
import { getInstrumentsByCategory } from '@/lib/fretboard/instrument-specs';

interface Props {
  config: FretboardConfig;
  shapes: ChordShape[];
  currentShapeIndex: number;
  availableTunings: Tuning[];
  onShapeChange: (i: number) => void;
  onInstrumentChange: (i: FretboardInstrument) => void;
  onTuningChange: (id: string) => void;
  onViewChange: (v: FretboardView) => void;
  onDisplayChange: (d: FretboardDisplay) => void;
  onOrientationChange: (o: FretboardOrientation) => void;
}

const INSTRUMENT_CATEGORIES = getInstrumentsByCategory();

const DISPLAY_OPTIONS: { id: FretboardDisplay; label: string }[] = [
  { id: 'fingering', label: 'Dedos' },
  { id: 'note-names', label: 'Notas' },
  { id: 'degrees', label: 'Graus' },
  { id: 'none', label: '—' },
];

function translateDifficulty(d: string): string {
  const map: Record<string, string> = {
    easy: 'fácil',
    medium: 'médio',
    hard: 'difícil',
    advanced: 'avançado',
  };
  return map[d] || d;
}

function difficultyColor(d: string): string {
  const map: Record<string, string> = {
    easy: 'text-green-500',
    medium: 'text-amber-500',
    hard: 'text-orange-500',
    advanced: 'text-red-500',
  };
  return map[d] || '';
}

export function FretboardControls(props: Props) {
  const {
    config,
    shapes,
    currentShapeIndex,
    availableTunings,
    onShapeChange,
    onInstrumentChange,
    onTuningChange,
    onViewChange,
    onDisplayChange,
    onOrientationChange,
  } = props;

  return (
    <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
      {/* Posições CAGED */}
      {shapes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Posição ({currentShapeIndex + 1}/{shapes.length})
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onShapeChange(Math.max(0, currentShapeIndex - 1))}
                disabled={currentShapeIndex === 0}
                className="w-7 h-7 rounded-md bg-muted hover:bg-muted/70 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  onShapeChange(Math.min(shapes.length - 1, currentShapeIndex + 1))
                }
                disabled={currentShapeIndex === shapes.length - 1}
                className="w-7 h-7 rounded-md bg-muted hover:bg-muted/70 disabled:opacity-30 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {shapes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onShapeChange(i)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  i === currentShapeIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
                title={s.shapeName}
              >
                {s.shapeName}
                <span className={`ml-1 ${difficultyColor(s.difficulty)}`}>
                  · {translateDifficulty(s.difficulty)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instrumento */}
        <div className="md:col-span-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Instrumento
          </div>
          <div className="space-y-2">
            {Object.entries(INSTRUMENT_CATEGORIES).map(([category, instruments]) => (
              <div key={category}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {category}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {instruments.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => onInstrumentChange(inst.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        config.instrument === inst.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                      title={inst.description}
                    >
                      <span>{inst.emoji}</span>
                      <span>{inst.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Afinação */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Afinação
          </div>
          <select
            value={config.tuning.id}
            onChange={(e) => onTuningChange(e.target.value)}
            className="w-full h-9 px-2 rounded-md bg-muted text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {availableTunings.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vista */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Vista
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onViewChange('diagram')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                config.view === 'diagram'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              Diagrama
            </button>
            <button
              onClick={() => onViewChange('full')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                config.view === 'full'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              Braço
            </button>
          </div>
        </div>

        {/* Exibir */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Exibir
          </div>
          <div className="flex gap-1">
            {DISPLAY_OPTIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => onDisplayChange(d.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  config.display === d.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mão */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Mão
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onOrientationChange('right-handed')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                config.orientation === 'right-handed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              Destro
            </button>
            <button
              onClick={() => onOrientationChange('left-handed')}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                config.orientation === 'left-handed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              Canhoto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
