import type { PianoDisplayMode } from '@/lib/piano/piano-types';

interface Props {
  value: PianoDisplayMode;
  onChange: (m: PianoDisplayMode) => void;
}

const OPTIONS: { id: PianoDisplayMode; label: string }[] = [
  { id: 'note-names', label: 'Notas' },
  { id: 'degrees', label: 'Graus' },
  { id: 'fingering', label: 'Dedos' },
  { id: 'none', label: '—' },
];

export function PianoDisplayToggle({ value, onChange }: Props) {
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
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
