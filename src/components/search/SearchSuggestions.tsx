import { Clock, TrendingUp, X } from 'lucide-react';

interface Props {
  history: string[];
  onPick: (q: string) => void;
  onRemoveHistory: (q: string) => void;
  onClearHistory: () => void;
}

const POPULAR_SUGGESTIONS = [
  'Cmaj7',
  'Dm7',
  'G7',
  'Am',
  'F',
  'C/E',
  'B7#9',
  'Dm7b5',
];

export function SearchSuggestions({
  history,
  onPick,
  onRemoveHistory,
  onClearHistory,
}: Props) {
  return (
    <div className="p-2 space-y-3">
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Recentes
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Limpar
            </button>
          </div>
          <div className="space-y-0.5">
            {history.map((h) => (
              <div
                key={h}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted"
              >
                <button
                  onClick={() => onPick(h)}
                  className="flex-1 text-left text-sm"
                >
                  {h}
                </button>
                <button
                  onClick={() => onRemoveHistory(h)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-background"
                  aria-label="Remover"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3" />
          Populares
        </div>
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {POPULAR_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onPick(s)}
              className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-medium transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
