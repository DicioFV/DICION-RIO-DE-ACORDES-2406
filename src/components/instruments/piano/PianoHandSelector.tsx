import type { PianoHand } from '@/lib/piano/piano-types';

interface Props {
  value: PianoHand;
  onChange: (h: PianoHand) => void;
}

const OPTIONS: { id: PianoHand; label: string; emoji: string }[] = [
  { id: 'left', label: 'E', emoji: '🤚' },
  { id: 'both', label: 'Ambas', emoji: '🙌' },
  { id: 'right', label: 'D', emoji: '✋' },
];

export function PianoHandSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
            value === o.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/70'
          }`}
          title={o.label}
        >
          {o.emoji} {o.label}
        </button>
      ))}
    </div>
  );
}
