import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, ChevronRight } from 'lucide-react';
import { SearchBox } from '@/components/search/SearchBox';
import { KeyboardShortcut } from '@/components/search/KeyboardShortcut';
import { navigateTo } from '@/hooks/useRouter';
import { NOTAS_NATURAIS, NOTAS_ALTERADAS } from '@/lib/dicionario/slugs';
import { TAGS_MUSICAIS } from '@/lib/dicionario/tags';
import { getChordsByRoot, getDatabaseStats } from '@/data/chords/chord-database';
import { CATEGORIAS_CONFIG } from '@/lib/dicionario/filtros';

export function DictionaryPage() {
  const [stats, setStats] = useState<ReturnType<typeof getDatabaseStats> | null>(null);

  useEffect(() => {
    try {
      setStats(getDatabaseStats());
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="min-h-screen">
      <KeyboardShortcut />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 py-16 sm:py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
            <Music className="h-3.5 w-3.5" />
            Dicionário de Acordes
            {stats && <span className="bg-primary/20 px-2 py-0.5 rounded-full">{stats.total.toLocaleString()}+ acordes</span>}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-extrabold text-4xl md:text-6xl tracking-tight mb-4">
            Dicionário de{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Acordes</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            O maior dicionário de acordes do Brasil. Interativo, com áudio, para piano, violão, guitarra, ukulele, cavaquinho e bandolim.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto">
            <SearchBox variant="hero" />
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { v: stats.total.toLocaleString(), l: 'Acordes' },
                { v: '42', l: 'Qualidades' },
                { v: '12', l: 'Tonalidades' },
                { v: '7', l: 'Instrumentos' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="text-3xl font-bold text-primary">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Style tags */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Filtrar por estilo</h2>
        <div className="flex flex-wrap gap-2">
          {TAGS_MUSICAIS.map((tag) => (
            <span key={tag.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${tag.cor}`}>
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
      </section>

      {/* TONALIDADE GRID */}
      <section className="max-w-6xl mx-auto px-4 pb-8 space-y-8">
        <div>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">🎵 Notas Naturais</h2>
          <NoteGrid notes={NOTAS_NATURAIS} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">🎼 Com Alteração</h2>
          <NoteGrid notes={NOTAS_ALTERADAS} />
        </div>
      </section>

      {/* Quick categories */}
      <section className="bg-muted/30 border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-extrabold mb-6">Navegar por categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(CATEGORIAS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => navigateTo(`/dicionario-tonalidade/do?cat=${key}`)}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition group cursor-pointer">
                <span className="text-2xl">{cfg.emoji}</span>
                <div className="text-left">
                  <span className="text-sm font-semibold group-hover:text-primary transition">{cfg.label}</span>
                  <div className="text-[10px] text-muted-foreground">{cfg.descricao}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NoteGrid({ notes }: { notes: { nota: string; nome: string; slug: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map(({ nota, nome, slug }, idx) => {
        const chords = getChordsByRoot(nota);
        const baseChords = chords.filter((c) => !c.isSlashChord && !c.isPolychord).slice(0, 5);

        return (
          <motion.div key={nota} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}>
            <button onClick={() => navigateTo(`/dicionario-tonalidade/${slug}`)}
              className="w-full text-left bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg transition group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black group-hover:text-primary transition">{nota}</span>
                  <span className="text-sm text-muted-foreground">({nome})</span>
                </div>
                <span className="text-xs text-muted-foreground">{chords.filter((c) => !c.isSlashChord && !c.isPolychord).length} acordes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {baseChords.map((c) => (
                  <span key={c.id} className="text-xs px-2 py-0.5 rounded bg-muted font-mono">{c.symbol}</span>
                ))}
                {chords.length > 5 && <span className="text-xs text-muted-foreground">+{chords.filter((c) => !c.isSlashChord).length - 5}</span>}
              </div>
              <div className="flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                Ver todos <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
