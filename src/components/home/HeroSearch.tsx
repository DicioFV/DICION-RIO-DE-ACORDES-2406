import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchBox } from '@/components/search/SearchBox';
import { KeyboardShortcut } from '@/components/search/KeyboardShortcut';

export function HeroSearch() {
  return (
    <section id="home" className="relative overflow-hidden">
      <KeyboardShortcut />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-32 md:pb-36 relative">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Versão 1.0 — Harmonia Premium
          </motion.div>

          {/* Title */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
            O{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              dicionário definitivo
            </span>
            <br />
            de acordes
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Piano, violão, guitarra, ukulele, cavaquinho e bandolim. Mais de{' '}
            <strong className="text-foreground">1.000 acordes</strong> com áudio
            profissional, inversões, voicings e teoria aplicada.
          </motion.p>

          {/* Search Box - Now functional! */}
          <motion.div
            className="mt-10 relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <SearchBox variant="hero" />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <a
              href="#instrumentos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Explorar Instrumentos
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted/50 transition-all duration-300"
            >
              Sobre o Projeto
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
