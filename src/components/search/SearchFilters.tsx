import { useSearchStore } from '@/store/useSearchStore';
import type { ChordCategory } from '@/lib/music-theory/types';

const CATEGORIES: { id: ChordCategory; label: string }[] = [
  { id: 'triad', label: 'Tríades' },
  { id: 'seventh', label: 'Sétimas' },
  { id: 'extended', label: 'Estendidos' },
  { id: 'altered', label: 'Alterados' },
  { id: 'suspended', label: 'Suspensos' },
  { id: 'added', label: 'Add' },
  { id: 'sixth', label: 'Sextas' },
  { id: 'diminished', label: 'Diminutos' },
  { id: 'augmented', label: 'Aumentados' },
  { id: 'slash', label: 'Slash' },
  { id: 'polychord', label: 'Poliacordes' },
];

const COMPLEXITIES = [
  { id: 'beginner', label: 'Iniciante' },
  { id: 'basic', label: 'Básico' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
  { id: 'master', label: 'Mestre' },
];

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export function SearchFilters() {
  const { filters, setFilters, resetFilters } = useSearchStore();

  const hasFilters =
    filters.category || filters.complexity || filters.rootNote;

  return (
    <aside className="space-y-6 p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filtros</h3>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Limpar
          </button>
        )}
      </div>

      <FilterGroup title="Tonalidade">
        <div className="flex flex-wrap gap-1">
          {ROOTS.map((root) => (
            <FilterChip
              key={root}
              active={filters.rootNote === root}
              onClick={() =>
                setFilters({
                  ...filters,
                  rootNote: filters.rootNote === root ? undefined : root,
                })
              }
            >
              {root}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Categoria">
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            active={filters.category === c.id}
            onClick={() =>
              setFilters({
                ...filters,
                category: filters.category === c.id ? undefined : c.id,
              })
            }
          >
            {c.label}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup title="Complexidade">
        {COMPLEXITIES.map((c) => (
          <FilterChip
            key={c.id}
            active={filters.complexity === c.id}
            onClick={() =>
              setFilters({
                ...filters,
                complexity: filters.complexity === c.id ? undefined : c.id,
              })
            }
          >
            {c.label}
          </FilterChip>
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted hover:bg-muted/70'
      }`}
    >
      {children}
    </button>
  );
}
