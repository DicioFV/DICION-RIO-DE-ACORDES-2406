import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, Layers, RefreshCw, Zap, BookOpen } from 'lucide-react';
import {
  tryParseChord,
  getChordFormula,
  getChordDescription,
  getInversions,
  applyVoicing,
  getHarmonicFunction,
  createNote,
  CHORD_QUALITIES,
  getAllVoicingTypes,
  getVoicingDescription,
  type VoicingType,
} from '@/lib/music-theory';

const SAMPLE_CHORDS = [
  'Cmaj7',
  'Dm7',
  'G7',
  'Am7',
  'Fmaj7',
  'Bdim',
  'E7#9',
  'Dbmaj9',
  'F#m7b5',
  'Bb13',
];

export function MusicTheoryDemo() {
  const [chordInput, setChordInput] = useState('Cmaj7');
  const [selectedVoicing, setSelectedVoicing] = useState<VoicingType>('close');
  const [showAllQualities, setShowAllQualities] = useState(false);

  const parsedChord = useMemo(() => tryParseChord(chordInput), [chordInput]);
  
  const chordWithVoicing = useMemo(() => {
    if (!parsedChord) return null;
    return applyVoicing(parsedChord, selectedVoicing, 4);
  }, [parsedChord, selectedVoicing]);

  const inversions = useMemo(() => {
    if (!parsedChord) return [];
    return getInversions(parsedChord);
  }, [parsedChord]);

  const harmonicFunction = useMemo(() => {
    if (!parsedChord) return null;
    return getHarmonicFunction(parsedChord, createNote('C'));
  }, [parsedChord]);

  const voicingTypes = getAllVoicingTypes();

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-semibold text-secondary mb-6">
            <Zap className="h-3.5 w-3.5" />
            Motor Teórico Musical — Bloco 02
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Engine de{' '}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Teoria Musical
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            40+ qualidades de acordes, inversões, voicings, análise reversa e funções harmônicas.
            Tudo em TypeScript puro, agnóstico de UI.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Chord Input */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                Digite um acorde
              </label>
              <input
                type="text"
                value={chordInput}
                onChange={(e) => setChordInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-muted border border-border text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: Cmaj7, Dm9, G7#5"
              />
              
              {/* Quick Samples */}
              <div className="flex flex-wrap gap-2 mt-4">
                {SAMPLE_CHORDS.map((chord) => (
                  <button
                    key={chord}
                    onClick={() => setChordInput(chord)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      chordInput === chord
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {chord}
                  </button>
                ))}
              </div>
            </div>

            {/* Voicing Selector */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent" />
                Voicing
              </label>
              <div className="grid grid-cols-2 gap-2">
                {voicingTypes.map((voicing) => (
                  <button
                    key={voicing}
                    onClick={() => setSelectedVoicing(voicing)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                      selectedVoicing === voicing
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {voicing}
                  </button>
                ))}
              </div>
              {selectedVoicing && (
                <p className="text-xs text-muted-foreground mt-3">
                  {getVoicingDescription(selectedVoicing)}
                </p>
              )}
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {parsedChord ? (
              <>
                {/* Chord Info */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-bold font-mono text-primary">
                        {parsedChord.symbol}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getChordDescription(parsedChord)}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-semibold">
                      {parsedChord.quality.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Fórmula
                      </span>
                      <p className="font-mono text-sm mt-1 font-semibold">
                        {getChordFormula(parsedChord)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Notas
                      </span>
                      <p className="font-mono text-sm mt-1 font-semibold">
                        {parsedChord.notes.map((n) => n.name).join(' - ')}
                      </p>
                    </div>
                  </div>

                  {/* Pitches with Voicing */}
                  {chordWithVoicing?.pitches && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Pitches ({selectedVoicing})
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {chordWithVoicing.pitches.map((p, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono"
                          >
                            {p.note.name}{p.octave}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Inversions */}
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-secondary" />
                    Inversões ({inversions.length})
                  </h4>
                  <div className="space-y-2">
                    {inversions.map((inv, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <span className="text-xs font-medium">
                          {i === 0 ? 'Fundamental' : `${i}ª Inversão`}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {inv.notes.map((n) => n.name).join(' - ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harmonic Function */}
                {harmonicFunction && (
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      Função Harmônica (em C maior)
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-accent">
                        {harmonicFunction.degree}
                      </span>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {harmonicFunction.function.replace('-', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {harmonicFunction.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center">
                <p className="text-destructive font-medium">
                  Acorde não reconhecido: "{chordInput}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tente um símbolo válido como Cmaj7, Dm7, G7#9
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Chord Qualities Showcase */}
        <motion.div
          className="mt-12 p-6 rounded-2xl border border-border bg-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold">
              {CHORD_QUALITIES.length} Qualidades de Acordes Disponíveis
            </h4>
            <button
              onClick={() => setShowAllQualities(!showAllQualities)}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              {showAllQualities ? 'Mostrar menos' : 'Ver todas'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(showAllQualities ? CHORD_QUALITIES : CHORD_QUALITIES.slice(0, 20)).map((q) => (
              <button
                key={q.id}
                onClick={() => setChordInput(`C${q.symbol}`)}
                className="px-2 py-1 rounded bg-muted hover:bg-primary/20 hover:text-primary text-xs font-mono transition-colors cursor-pointer"
                title={q.fullName}
              >
                C{q.symbol || '(maj)'}
              </button>
            ))}
            {!showAllQualities && CHORD_QUALITIES.length > 20 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{CHORD_QUALITIES.length - 20} mais...
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
