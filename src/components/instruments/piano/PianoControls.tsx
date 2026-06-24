import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type {
  PianoHand,
  PianoDisplayMode,
  PianoRange,
} from '@/lib/piano/piano-types';
import { PianoHandSelector } from './PianoHandSelector';
import { PianoDisplayToggle } from './PianoDisplayToggle';

interface Props {
  voicing: string;
  inversion: number;
  maxInversions: number;
  hand: PianoHand;
  displayMode: PianoDisplayMode;
  range: PianoRange;
  octaveOffset: number;
  onVoicingChange: (v: string) => void;
  onInversionChange: (i: number) => void;
  onHandChange: (h: PianoHand) => void;
  onDisplayModeChange: (m: PianoDisplayMode) => void;
  onRangeChange: (r: PianoRange) => void;
  onOctaveChange: (o: number) => void;
}

const VOICINGS = [
  { id: 'close', label: 'Fechado' },
  { id: 'open', label: 'Aberto' },
  { id: 'drop2', label: 'Drop 2' },
  { id: 'drop3', label: 'Drop 3' },
  { id: 'spread', label: 'Spread' },
  { id: 'rootless-a', label: 'Rootless A' },
  { id: 'rootless-b', label: 'Rootless B' },
];

const RANGES: { id: PianoRange; label: string; short: string }[] = [
  { id: 'chord-focus', label: 'Foco', short: '🎯' },
  { id: 'compact-25', label: '2 oitavas', short: '2' },
  { id: 'compact-49', label: '4 oitavas', short: '4' },
  { id: 'full-88', label: '88 teclas', short: '88' },
];

export function PianoControls(props: Props) {
  const {
    voicing,
    inversion,
    maxInversions,
    hand,
    displayMode,
    range,
    octaveOffset,
    onVoicingChange,
    onInversionChange,
    onHandChange,
    onDisplayModeChange,
    onRangeChange,
    onOctaveChange,
  } = props;

  return (
    <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
      {/* Linha 1: Inversões e Oitava */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Inversões */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Inversão:
          </span>
          <div className="flex gap-1">
            {Array.from({ length: maxInversions }).map((_, i) => (
              <button
                key={i}
                onClick={() => onInversionChange(i)}
                className={`w-9 h-9 rounded-md text-sm font-semibold transition cursor-pointer ${
                  inversion === i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
                aria-label={`Inversão ${i}`}
              >
                {i === 0 ? 'F' : i}
              </button>
            ))}
          </div>
        </div>

        {/* Oitava */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Oitava:
          </span>
          <button
            onClick={() => onOctaveChange(octaveOffset - 1)}
            className="w-8 h-8 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center cursor-pointer"
            aria-label="Oitava abaixo"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm w-8 text-center">
            {octaveOffset >= 0 ? `+${octaveOffset}` : octaveOffset}
          </span>
          <button
            onClick={() => onOctaveChange(octaveOffset + 1)}
            className="w-8 h-8 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center cursor-pointer"
            aria-label="Oitava acima"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {octaveOffset !== 0 && (
            <button
              onClick={() => onOctaveChange(0)}
              className="text-xs text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              aria-label="Resetar oitava"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Linha 2: Voicings */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Voicing
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VOICINGS.map((v) => (
            <button
              key={v.id}
              onClick={() => onVoicingChange(v.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                voicing === v.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Linha 3: Range, Visualização, Mão */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Visualização
          </div>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => onRangeChange(r.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  range === r.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
                title={r.label}
              >
                {r.short}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Exibir
          </div>
          <PianoDisplayToggle value={displayMode} onChange={onDisplayModeChange} />
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Mão
          </div>
          <PianoHandSelector value={hand} onChange={onHandChange} />
        </div>
      </div>
    </div>
  );
}
