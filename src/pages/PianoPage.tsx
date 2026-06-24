import { useState, useMemo } from 'react';
import { Piano } from '@/components/instruments/piano/Piano';
import { tryParseChord } from '@/lib/music-theory';
import { PlayButton } from '@/components/audio/PlayButton';
import { AudioControls } from '@/components/audio/AudioControls';

const DEMO_CHORDS = ['C', 'Cm', 'Cmaj7', 'Cm7', 'C7', 'Dm9', 'G7', 'Fmaj7', 'Am7', 'C/E'];

export function PianoPage() {
  const [symbol, setSymbol] = useState('Cmaj7');
  const chord = useMemo(() => tryParseChord(symbol), [symbol]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight mb-3">
          🎹 Piano{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Virtual
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Visualize acordes com inversões, voicings, dedilhado e indicação de mão.
        </p>
      </div>

      {/* Chord selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {DEMO_CHORDS.map((c) => (
          <button key={c} onClick={() => setSymbol(c)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              symbol === c ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-card border border-border hover:border-primary/40'
            }`}>{c}</button>
        ))}
      </div>

      {/* Custom input */}
      <div className="max-w-md mx-auto mb-8">
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)}
          placeholder="Digite um acorde (Ex: Cmaj7, Dm9)"
          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-card text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      {/* Chord info + Play */}
      {chord && (
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">{chord.symbol}</div>
            <div className="text-sm text-muted-foreground">
              {chord.notes.map((n) => n.name).join(' · ')}
            </div>
          </div>
          <PlayButton chord={chord} size="lg" />
        </div>
      )}

      <Piano chord={chord} />

      <div className="mt-8">
        <AudioControls />
      </div>
    </div>
  );
}
