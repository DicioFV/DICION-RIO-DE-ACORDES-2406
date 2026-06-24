import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Guitar } from 'lucide-react';
import { Fretboard } from '@/components/instruments/fretboard/Fretboard';
import { tryParseChord } from '@/lib/music-theory';
import type { FretboardInstrument } from '@/lib/fretboard/fretboard-types';
import { getAllInstruments } from '@/lib/fretboard/instrument-specs';

const DEMO_CHORDS = [
  'C', 'G', 'D', 'Am', 'Em', 'F', 'A', 'E',
  'Dm7', 'G7', 'Cmaj7', 'Bm',
];

const instruments = getAllInstruments();

export function GuitarDemo() {
  const [selectedSymbol, setSelectedSymbol] = useState('G');
  const [selectedInstrument, setSelectedInstrument] = useState<FretboardInstrument>('guitar-nylon');

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-6">
            <Guitar className="h-3.5 w-3.5" />
            6 Instrumentos de Cordas — Blocos 06 & 07
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Diagramas de{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              acordes
            </span>{' '}
            para todos os instrumentos
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Violão, guitarra, ukulele, cavaquinho e bandolim.
            Múltiplas posições CAGED, pestanas automáticas,
            afinações alternativas e modo canhoto.
          </p>
        </motion.div>

        {/* Instrument Selector */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {instruments.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstrument(inst.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                  selectedInstrument === inst.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card border border-border hover:border-primary/40'
                }`}
              >
                <span className="text-lg">{inst.emoji}</span>
                <span>{inst.shortName}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chord Selector */}
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
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  selectedSymbol === symbol
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25'
                    : 'bg-card border border-border hover:border-accent/40'
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
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={`${chord.symbol}-${selectedInstrument}`}
          >
            <div className="text-3xl font-bold text-accent mb-1">
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

        {/* Fretboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          key={selectedInstrument}
        >
          <Fretboard
            chord={chord}
            defaultInstrument={selectedInstrument}
          />
        </motion.div>
      </div>
    </section>
  );
}
