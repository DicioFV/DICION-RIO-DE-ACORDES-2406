import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { PlayButton } from '@/components/audio/PlayButton';
import { AudioControls } from '@/components/audio/AudioControls';
import { tryParseChord } from '@/lib/music-theory';
import { useAudioInit } from '@/hooks/useAudioInit';

const DEMO_CHORDS = ['C', 'Dm7', 'G7', 'Cmaj7', 'F', 'Am7', 'Em', 'Bdim'];

export function AudioDemo() {
  const [selectedSymbol, setSelectedSymbol] = useState('Cmaj7');
  const ready = useAudioInit();

  const chord = useMemo(
    () => tryParseChord(selectedSymbol),
    [selectedSymbol]
  );

  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-600 dark:text-green-400 mb-6">
            <Volume2 className="h-3.5 w-3.5" />
            Motor de Áudio — Bloco 08
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Áudio{' '}
            <span className="bg-gradient-to-r from-green-500 to-primary bg-clip-text text-transparent">
              profissional
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            13 timbres premium, 6 modos de reprodução, samples reais com
            Tone.js. Clique para ouvir.
          </p>
          {!ready && (
            <p className="mt-3 text-xs text-accent animate-pulse">
              🎵 Clique em qualquer lugar para ativar o áudio
            </p>
          )}
        </motion.div>

        {/* Chord Selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {DEMO_CHORDS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                selectedSymbol === symbol
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                  : 'bg-card border border-border hover:border-green-500/40'
              }`}
            >
              {symbol}
            </button>
          ))}
        </motion.div>

        {/* Main Player */}
        <motion.div
          className="mb-8 p-8 rounded-2xl border border-border bg-gradient-to-br from-green-500/5 to-primary/5 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          key={selectedSymbol}
        >
          <div className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
            {chord?.symbol || '?'}
          </div>
          <div className="text-sm text-muted-foreground mb-6">
            {chord?.notes.map((n) => n.name).join(' · ')}
          </div>
          <div className="flex justify-center">
            <PlayButton chord={chord} size="xl" />
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AudioControls />
        </motion.div>
      </div>
    </section>
  );
}
