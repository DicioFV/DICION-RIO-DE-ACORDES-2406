import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { GLOSSARIO, NOMES_CATEGORIAS, type CategoriaGlossario, type NivelTermo, type TermoGlossario } from '@/lib/pedagogia/glossario';
import { useDebounce } from '@/hooks/useDebounce';

const NIVEIS_FILTRO = [
  { id: 'todos' as const, label: 'Todos', emoji: '📚' },
  { id: 'iniciante' as const, label: 'Iniciante', emoji: '🌱' },
  { id: 'intermediario' as const, label: 'Intermediário', emoji: '🔥' },
  { id: 'avancado' as const, label: 'Avançado', emoji: '👑' },
];

const NIVEL_BADGE: Record<string, string> = {
  iniciante: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  intermediario: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  avancado: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
};

export function GlossaryPage() {
  const [busca, setBusca] = useState('');
  const [nivelFiltro, setNivelFiltro] = useState<NivelTermo | 'todos'>('todos');
  const [catFiltro, setCatFiltro] = useState<CategoriaGlossario | 'todas'>('todas');
  const [expandido, setExpandido] = useState<string | null>(null);
  const buscaD = useDebounce(busca, 150);

  const termos = useMemo(() => {
    return GLOSSARIO.filter((t) => {
      if (nivelFiltro !== 'todos' && t.nivel !== nivelFiltro) return false;
      if (catFiltro !== 'todas' && t.categoria !== catFiltro) return false;
      if (buscaD) {
        const q = buscaD.toLowerCase();
        return t.termo.toLowerCase().includes(q) || t.tooltipTexto.toLowerCase().includes(q) || t.definicaoSimples.toLowerCase().includes(q);
      }
      return true;
    });
  }, [buscaD, nivelFiltro, catFiltro]);

  // Group by category when no search
  const grouped = useMemo(() => {
    if (buscaD || catFiltro !== 'todas') return { results: termos };
    const g: Record<string, TermoGlossario[]> = {};
    for (const t of termos) { if (!g[t.categoria]) g[t.categoria] = []; g[t.categoria].push(t); }
    return g;
  }, [termos, buscaD, catFiltro]);

  const cats = Object.keys(NOMES_CATEGORIAS) as CategoriaGlossario[];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
            Glossário de <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Harmonia</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {GLOSSARIO.length} termos musicais explicados em 3 níveis: do básico ao profissional.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar termo... (trítono, voicing, cadência)"
              className="w-full pl-11 pr-10 py-4 rounded-2xl bg-card border border-border text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
            {busca && <button onClick={() => setBusca('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-muted-foreground">Nível:</span>
          {NIVEIS_FILTRO.map((n) => (
            <button key={n.id} onClick={() => setNivelFiltro(n.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${nivelFiltro === n.id ? 'bg-violet-600 text-white' : 'bg-card border border-border hover:border-violet-300'}`}>
              {n.emoji} {n.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-muted-foreground">Categoria:</span>
          <button onClick={() => setCatFiltro('todas')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${catFiltro === 'todas' ? 'bg-violet-600 text-white' : 'bg-card border border-border'}`}>Todas</button>
          {cats.map((c) => (
            <button key={c} onClick={() => setCatFiltro(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${catFiltro === c ? 'bg-violet-600 text-white' : 'bg-card border border-border hover:border-violet-300'}`}>
              {NOMES_CATEGORIAS[c]}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{termos.length} termo{termos.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-10">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            {cat !== 'results' && (
              <h2 className="text-lg font-extrabold mb-4 pb-2 border-b border-border flex items-center gap-2">
                {NOMES_CATEGORIAS[cat as CategoriaGlossario]} <span className="text-xs font-normal text-muted-foreground">({items.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((t, idx) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                  <div className={`bg-card rounded-xl border transition ${expandido === t.id ? 'border-violet-400 shadow-md' : 'border-border hover:border-violet-200'}`}>
                    <button onClick={() => setExpandido(expandido === t.id ? null : t.id)} className="w-full flex items-center gap-3 p-4 text-left cursor-pointer">
                      {t.simbolo && <code className="shrink-0 text-sm font-mono font-black text-violet-600 dark:text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">{t.simbolo}</code>}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{t.termo}</span>
                          {t.termoIngles && <span className="text-xs text-muted-foreground italic">({t.termoIngles})</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{t.tooltipTexto}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${NIVEL_BADGE[t.nivel] || ''}`}>
                        {t.nivel === 'iniciante' ? '🌱' : t.nivel === 'intermediario' ? '🔥' : '👑'}
                      </span>
                      {expandido === t.id ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {expandido === t.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden">
                          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">{t.definicaoSimples}</p>
                            {t.definicaoCompleta !== t.definicaoSimples && (
                              <p className="text-sm text-muted-foreground/80 border-l-2 border-violet-300 pl-3">{t.definicaoCompleta}</p>
                            )}
                            {t.exemplos.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Exemplos:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {t.exemplos.map((ex, i) => <code key={i} className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{ex}</code>)}
                                </div>
                              </div>
                            )}
                            {t.exemplosMusicas && t.exemplosMusicas.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {t.exemplosMusicas.map((m, i) => <span key={i} className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">🎵 {m}</span>)}
                              </div>
                            )}
                            {t.curiosidade && (
                              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">💡 {t.curiosidade}</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
        {termos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl">🔍</div>
            <p className="text-muted-foreground mt-4">Nenhum termo encontrado para "{busca}"</p>
            <button onClick={() => { setBusca(''); setNivelFiltro('todos'); setCatFiltro('todas'); }} className="mt-3 text-violet-600 hover:underline text-sm cursor-pointer">Limpar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
}
