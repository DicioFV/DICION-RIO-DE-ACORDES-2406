import { useState, useMemo } from 'react';
import { Fretboard } from '@/components/instruments/fretboard/Fretboard';
import { tryParseChord } from '@/lib/music-theory';
import { PlayButton } from '@/components/audio/PlayButton';
import { AudioControls } from '@/components/audio/AudioControls';
import { getAllInstruments } from '@/lib/fretboard/instrument-specs';
import type { FretboardInstrument } from '@/lib/fretboard/fretboard-types';

const DEMO_CHORDS = ['C', 'G', 'D', 'Am', 'Em', 'F', 'A', 'E', 'Dm7', 'G7', 'Cmaj7', 'Bm'];
const instruments = getAllInstruments();

export function GuitarPage() {
  const [symbol, setSymbol] = useState('G');
  const [instrument, setInstrument] = useState<FretboardInstrument>('guitar-nylon');
  const chord = useMemo(() => tryParseChord(symbol), [symbol]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight mb-3">
          🎸 Instrumentos de{' '}
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Cordas
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Violão, guitarra, ukulele, cavaquinho e bandolim com sistema CAGED.
        </p>
      </div>

      {/* Instrument selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {instruments.map((inst) => (
          <button key={inst.id} onClick={() => setInstrument(inst.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              instrument === inst.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-card border border-border hover:border-primary/40'
            }`}>
            <span className="text-lg">{inst.emoji}</span>{inst.shortName}
          </button>
        ))}
      </div>

      {/* Chord selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {DEMO_CHORDS.map((c) => (
          <button key={c} onClick={() => setSymbol(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
              symbol === c ? 'bg-accent text-accent-foreground' : 'bg-card border border-border hover:border-accent/40'
            }`}>{c}</button>
        ))}
      </div>

      <div className="max-w-md mx-auto mb-8">
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)}
          placeholder="Digite um acorde"
          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-card text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      {chord && (
        <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-accent">{chord.symbol}</div>
            <div className="text-sm text-muted-foreground">{chord.notes.map((n) => n.name).join(' · ')}</div>
          </div>
          <PlayButton chord={chord} size="lg" />
        </div>
      )}

      <Fretboard chord={chord} defaultInstrument={instrument} key={instrument} />

      <div className="mt-8">
        <AudioControls />
      </div>
    </div>
  );
}
