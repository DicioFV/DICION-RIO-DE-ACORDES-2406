import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid3X3, List, SlidersHorizontal, X, Music2 } from 'lucide-react';
import { navigateTo } from '@/hooks/useRouter';
import { SLUGS_TONALIDADES, NOTAS_DISPLAY, TODAS_NOTAS_CROMATICAS, TONALIDADES_SLUGS } from '@/lib/dicionario/slugs';
import { getChordsByRoot } from '@/data/chords/chord-database';
import type { ChordEntry } from '@/data/chords/chord-schema';
import {
  CATEGORIAS_CONFIG,
  COMPLEXIDADE_CONFIG,
  getComplexidadeFromChordComplexity,
  getCategoriaFromChordCategory,
  type CategoriaAcorde,
  type NivelComplexidade,
} from '@/lib/dicionario/filtros';
import { PlayButton } from '@/components/audio/PlayButton';
import { tryParseChord } from '@/lib/music-theory';

interface Props {
  slug: string;
}

type ViewMode = 'lista' | 'grid';

export function TonalityPage({ slug }: Props) {
  const nota = SLUGS_TONALIDADES[slug];

  if (!nota) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎼</div>
        <h1 className="font-extrabold text-3xl mb-3">Tonalidade não encontrada</h1>
        <button onClick={() => navigateTo('/dicionario')}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer">
          Voltar ao dicionário
        </button>
      </div>
    );
  }

  return <TonalityContent nota={nota} slug={slug} />;
}

function TonalityContent({ nota }: { nota: string; slug: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [searchText, setSearchText] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoriaAcorde[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<NivelComplexidade[]>([]);

  const displayName = NOTAS_DISPLAY[nota] || nota;

  // Get all chords for this root
  const allChords = useMemo(() => {
    return getChordsByRoot(nota).filter((c) => !c.isSlashChord && !c.isPolychord);
  }, [nota]);

  // Apply filters
  const filteredChords = useMemo(() => {
    return allChords.filter((c) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        if (!c.symbol.toLowerCase().includes(q) && !c.displayName.toLowerCase().includes(q)) return false;
      }
      if (selectedCategories.length > 0) {
        const cat = getCategoriaFromChordCategory(c.category);
        if (!selectedCategories.includes(cat)) return false;
      }
      if (selectedComplexity.length > 0) {
        const comp = getComplexidadeFromChordComplexity(c.complexity);
        if (!selectedComplexity.includes(comp)) return false;
      }
      return true;
    });
  }, [allChords, searchText, selectedCategories, selectedComplexity]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, ChordEntry[]> = {};
    for (const c of filteredChords) {
      const cat = getCategoriaFromChordCategory(c.category);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    }
    return groups;
  }, [filteredChords]);

  // Navigation
  const idx = TODAS_NOTAS_CROMATICAS.indexOf(nota);
  const prevNota = idx > 0 ? TODAS_NOTAS_CROMATICAS[idx - 1] : null;
  const nextNota = idx < TODAS_NOTAS_CROMATICAS.length - 1 ? TODAS_NOTAS_CROMATICAS[idx + 1] : null;

  const activeFilterCount = selectedCategories.length + selectedComplexity.length + (searchText ? 1 : 0);

  const toggleCategory = (cat: CategoriaAcorde) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const toggleComplexity = (comp: NivelComplexidade) => {
    setSelectedComplexity((prev) => prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedComplexity([]);
    setSearchText('');
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigateTo('/')} className="hover:text-foreground cursor-pointer">Início</button>
            <span>›</span>
            <button onClick={() => navigateTo('/dicionario')} className="hover:text-foreground cursor-pointer">Dicionário</button>
            <span>›</span>
            <span className="text-foreground font-semibold">Acordes de {nota}</span>
          </nav>

          {/* Nav prev/next */}
          <div className="flex items-center justify-between">
            {prevNota ? (
              <button onClick={() => navigateTo(`/dicionario-tonalidade/${TONALIDADES_SLUGS[prevNota]}`)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                <ChevronLeft className="h-4 w-4" /> {prevNota}
              </button>
            ) : <div />}

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Acordes de{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{displayName} ({nota})</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{allChords.length} acordes disponíveis</p>
            </div>

            {nextNota ? (
              <button onClick={() => navigateTo(`/dicionario-tonalidade/${TONALIDADES_SLUGS[nextNota]}`)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                {nextNota} <ChevronRight className="h-4 w-4" />
              </button>
            ) : <div />}
          </div>

          {/* Note selector */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {TODAS_NOTAS_CROMATICAS.map((n) => (
              <button key={n} onClick={() => navigateTo(`/dicionario-tonalidade/${TONALIDADES_SLUGS[n]}`)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition cursor-pointer ${
                  n === nota ? 'bg-primary text-primary-foreground shadow-lg scale-110' : 'bg-card border border-border hover:border-primary/40'
                }`}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
              placeholder={`Buscar em ${nota}... (ex: ${nota}7, ${nota}maj7)`}
              className="w-full pl-10 pr-8 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" />
            {searchText && (
              <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${
              filtersOpen || activeFilterCount > 0 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filtros
            {activeFilterCount > 0 && (
              <span className="bg-primary-foreground text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('lista')} className={`p-2 transition cursor-pointer ${viewMode === 'lista' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 transition cursor-pointer ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs text-muted-foreground whitespace-nowrap">{filteredChords.length}/{allChords.length}</span>
        </div>

        {/* Expandable filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden">
              <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Filtros</span>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-destructive hover:underline cursor-pointer">Limpar tudo</button>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Categoria</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(CATEGORIAS_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => toggleCategory(key as CategoriaAcorde)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                          selectedCategories.includes(key as CategoriaAcorde) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'
                        }`}>{cfg.emoji} {cfg.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Nível</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(COMPLEXIDADE_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => toggleComplexity(key as NivelComplexidade)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                          selectedComplexity.includes(key as NivelComplexidade) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'
                        }`}>{cfg.emoji} {cfg.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredChords.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎼</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum acorde encontrado</h3>
            <p className="text-muted-foreground mb-6">Ajuste os filtros ou busca</p>
            <button onClick={clearFilters} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer">Limpar filtros</button>
          </div>
        )}

        {viewMode === 'lista' && filteredChords.length > 0 && (
          <div className="space-y-8">
            {(['triades', 'tetrades', 'extensoes', 'sus', 'alterados'] as CategoriaAcorde[]).map((cat) => {
              const chords = grouped[cat];
              if (!chords || chords.length === 0) return null;
              const cfg = CATEGORIAS_CONFIG[cat];
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-3 pb-2 border-b border-border">
                    <span className="text-2xl">{cfg.emoji}</span>
                    <div>
                      <h2 className="text-lg font-bold">{cfg.label}</h2>
                      <p className="text-xs text-muted-foreground">{cfg.descricao}</p>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{chords.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {chords.map((chord) => (
                      <ChordListRow key={chord.id} chord={chord} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {viewMode === 'grid' && filteredChords.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredChords.map((chord, i) => (
              <ChordGridCard key={chord.id} chord={chord} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChordListRow({ chord }: { chord: ChordEntry }) {
  const parsed = useMemo(() => tryParseChord(chord.symbol), [chord.symbol]);
  const complexity = getComplexidadeFromChordComplexity(chord.complexity);
  const compCfg = COMPLEXIDADE_CONFIG[complexity];

  return (
    <div className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition group">
      <button onClick={() => navigateTo(`/acorde/${chord.slug}`)}
        className="w-24 shrink-0 font-bold text-base hover:text-primary transition cursor-pointer text-left">
        {chord.symbol}
      </button>
      <div className="flex-1 hidden sm:flex items-center gap-1 flex-wrap">
        {chord.notes.map((n, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded font-mono ${i === 0 ? 'bg-primary/15 text-primary font-semibold' : 'bg-muted text-muted-foreground'}`}>
            {n.name}
          </span>
        ))}
      </div>
      <div className="hidden md:block flex-1">
        <span className="text-sm text-muted-foreground truncate">{chord.displayName}</span>
      </div>
      <span className={`hidden lg:block text-xs font-medium ${compCfg.cor}`}>{compCfg.emoji} {compCfg.label}</span>
      <div className="flex items-center gap-2 shrink-0">
        {parsed && <PlayButton chord={parsed} size="sm" />}
        <button onClick={() => navigateTo(`/acorde/${chord.slug}`)}
          className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition cursor-pointer">
          Ver →
        </button>
      </div>
    </div>
  );
}

function ChordGridCard({ chord, index }: { chord: ChordEntry; index: number }) {
  const parsed = useMemo(() => tryParseChord(chord.symbol), [chord.symbol]);
  const complexity = getComplexidadeFromChordComplexity(chord.complexity);
  const compCfg = COMPLEXIDADE_CONFIG[complexity];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.02 }}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-md transition group">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs ${compCfg.cor}`}>{compCfg.emoji}</span>
      </div>
      <button onClick={() => navigateTo(`/acorde/${chord.slug}`)}
        className="text-2xl font-bold group-hover:text-primary transition cursor-pointer text-left w-full">
        {chord.symbol}
      </button>
      <div className="text-xs text-muted-foreground font-mono mt-1">{chord.notes.map((n) => n.name).join(' · ')}</div>
      <div className="flex items-center gap-1 mt-3">
        {parsed && <PlayButton chord={parsed} size="sm" />}
        <button onClick={() => navigateTo(`/acorde/${chord.slug}`)}
          className="flex-1 text-center py-1.5 rounded-lg text-xs bg-primary text-primary-foreground font-medium cursor-pointer">
          Ver
        </button>
      </div>
    </motion.div>
  );
}
