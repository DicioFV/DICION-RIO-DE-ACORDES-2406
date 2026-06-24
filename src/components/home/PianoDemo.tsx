import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { Piano } from '@/components/instruments/piano/Piano';
import { tryParseChord } from '@/lib/music-theory';

const DEMO_CHORDS = [
  'C',
  'Cm',
  'Cmaj7',
  'Cm7',
  'C7',
  'Dm9',
  'G7',
  'Fmaj7',
  'Am7',
  'C/E',
];

export function PianoDemo() {
  const [selectedSymbol, setSelectedSymbol] = useState('Cmaj7');

  const chord = useMemo(() => tryParseChord(selectedSymbol), [selectedSymbol]);

  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6">
            <Keyboard className="h-3.5 w-3.5" />
            Piano Virtual — Bloco 05
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Piano{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              interativo
            </span>{' '}
            profissional
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Visualize acordes com inversões, voicings, dedilhado sugerido e
            indicação de mão. Experimente os controles abaixo.
          </p>
        </motion.div>

        {/* Seletor de acordes */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_CHORDS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  selectedSymbol === symbol
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card border border-border hover:border-primary/40'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info do acorde */}
        {chord && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={chord.symbol}
          >
            <div className="text-3xl font-bold text-primary mb-1">
              {chord.symbol}
            </div>
            <div className="text-sm text-muted-foreground">
              Notas:{' '}
              <strong className="text-foreground">
                {chord.notes.map((n) => n.name).join(' · ')}
              </strong>
            </div>
          </motion.div>
        )}

        {/* Piano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Piano chord={chord} />
        </motion.div>
      </div>
    </section>
  );
}
