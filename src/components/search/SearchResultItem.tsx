import type { SearchResult } from '@/lib/search/search-types';
import { Star, Lock } from 'lucide-react';
import { useFavoritesChords } from '@/hooks/useFavoritesChords';

interface Props {
  result: SearchResult;
  active?: boolean;
  onSelect?: () => void;
}

export function SearchResultItem({ result, active, onSelect }: Props) {
  const { chord } = result;
  const { isFavorite, toggle } = useFavoritesChords();
  const fav = isFavorite(chord.id);

  const accessBadge = {
    free: {
      label: 'Grátis',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    pro: {
      label: 'PRO',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    master: {
      label: 'MASTER',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    premium: {
      label: 'PREMIUM',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  }[chord.accessLevel];

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition cursor-pointer group ${
        active ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
    >
      {/* Símbolo grande */}
      <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg">
        {chord.symbol}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm truncate">{chord.displayName}</h4>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accessBadge.color}`}
          >
            {chord.accessLevel !== 'free' && (
              <Lock className="inline h-2.5 w-2.5 mr-0.5" />
            )}
            {accessBadge.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {chord.notes.map((n) => n.name).join(' · ')}
        </p>
      </div>

      {/* Favorito */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle(chord.id);
        }}
        className="flex-shrink-0 p-2 rounded-md hover:bg-background transition"
        aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Star
          className={`h-4 w-4 transition ${
            fav ? 'fill-accent text-accent' : 'text-muted-foreground'
          }`}
        />
      </button>
    </div>
  );
}
