import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { SearchResultItem } from './SearchResultItem';
import { SearchSuggestions } from './SearchSuggestions';
import { trackEvent } from '@/lib/analytics';

interface SearchBoxProps {
  variant?: 'hero' | 'compact';
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Componente principal de busca com autocomplete
 */
export function SearchBox({
  variant = 'hero',
  placeholder = 'Busque um acorde... Ex: Cmaj7, Dm9, do menor sétima',
  autoFocus = false,
}: SearchBoxProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, isSearching, clear } = useSearch({
    limit: 8,
  });
  const {
    history,
    add: addHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useSearchHistory();

  const [activeIdx, setActiveIdx] = useState(-1);

  // Fecha ao clicar fora
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Reset active index quando resultados mudam
  useEffect(() => {
    setActiveIdx(-1);
  }, [results]);

  // Navegação por teclado
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      const chord = results[activeIdx]?.chord;
      if (chord) {
        addHistory(query);
        trackEvent('search_performed', { query, resultId: chord.id });
        // Em uma app real, navegaria para a página do acorde
        console.log('Selecionado:', chord.symbol);
        setFocused(false);
      }
    } else if (e.key === 'Escape') {
      clear();
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectResult = (chordId: string) => {
    addHistory(query);
    trackEvent('search_performed', { query, resultId: chordId });
    setFocused(false);
  };

  const showDropdown = focused && (query.length > 0 || history.length > 0);

  const isHero = variant === 'hero';
  const inputHeight = isHero ? 'h-16' : 'h-12';
  const inputPadding = isHero ? 'pl-14 pr-14' : 'pl-11 pr-11';
  const fontSize = isHero ? 'text-lg' : 'text-sm';
  const borderRadius = isHero ? 'rounded-2xl' : 'rounded-xl';
  const iconSize = isHero ? 'h-5 w-5' : 'h-4 w-4';
  const iconLeft = isHero ? 'left-5' : 'left-4';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative group">
        {/* Glow effect on focus (hero only) */}
        {isHero && (
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-500`}
          />
        )}

        <div className="relative">
          <Search
            className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 ${iconSize} transition-colors ${
              focused ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full ${inputHeight} ${inputPadding} ${borderRadius} ${fontSize} bg-card border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm focus:shadow-lg placeholder:text-muted-foreground/60`}
            aria-label="Buscar acorde"
            autoComplete="off"
            spellCheck={false}
          />
          {isSearching && (
            <Loader2
              className={`absolute right-14 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground`}
            />
          )}
          {query && (
            <button
              onClick={clear}
              className={`absolute ${isHero ? 'right-5' : 'right-4'} top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition cursor-pointer`}
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hint de atalhos (apenas hero, sem foco, sem query) */}
      {isHero && !focused && !query && (
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono">
            /
          </kbd>
          <span>para focar na busca</span>
        </div>
      )}

      {/* Dropdown de resultados */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-popover border border-border shadow-xl overflow-hidden z-50 max-h-[480px] overflow-y-auto"
          >
            {query && results.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {results.length} resultado{results.length > 1 ? 's' : ''}
                </div>
                {results.map((r, idx) => (
                  <SearchResultItem
                    key={r.chord.id}
                    result={r}
                    active={idx === activeIdx}
                    onSelect={() => handleSelectResult(r.chord.id)}
                  />
                ))}
              </div>
            )}

            {query && results.length === 0 && !isSearching && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🎵</div>
                <p className="text-sm font-medium">Nenhum acorde encontrado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tente:{' '}
                  <code className="px-1.5 py-0.5 rounded bg-muted">Cmaj7</code>,{' '}
                  <code className="px-1.5 py-0.5 rounded bg-muted">Dm9</code> ou{' '}
                  <code className="px-1.5 py-0.5 rounded bg-muted">do maior</code>
                </p>
              </div>
            )}

            {!query && history.length > 0 && (
              <SearchSuggestions
                history={history}
                onPick={(q) => setQuery(q)}
                onRemoveHistory={removeHistory}
                onClearHistory={clearHistory}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
