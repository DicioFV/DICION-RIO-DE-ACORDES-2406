import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Waves, Volume2, ArrowLeftRight, Music } from 'lucide-react';
import { NOTAS_DATABASE, NOTAS_POR_SLUG, type NotaCromatica } from '@/lib/notas/database';
import { gerarOitavasDaNota, getOitavaDestaque } from '@/lib/notas/frequencias';
import { navigateTo } from '@/hooks/useRouter';
import { getChordsByRoot } from '@/data/chords/chord-database';

interface Props { slug: string; }

export function NotePage({ slug }: Props) {
  const nota = NOTAS_POR_SLUG[slug];
  if (!nota) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h1 className="font-extrabold text-3xl mb-3">Nota não encontrada</h1>
        <button onClick={() => navigateTo('/notas')} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer">
          Voltar às notas
        </button>
      </div>
    );
  }
  return <NotePageContent nota={nota} />;
}

type ActiveTab = 'overview' | 'frequencies' | 'chords';

function NotePageContent({ nota }: { nota: NotaCromatica }) {
  const [tab, setTab] = useState<ActiveTab>('overview');

  const idx = NOTAS_DATABASE.findIndex((n) => n.id === nota.id);
  const prev = idx > 0 ? NOTAS_DATABASE[idx - 1] : null;
  const next = idx < NOTAS_DATABASE.length - 1 ? NOTAS_DATABASE[idx + 1] : null;

  const tabs: { id: ActiveTab; label: string; emoji: string }[] = [
    { id: 'overview', label: 'Visão Geral', emoji: '🎵' },
    { id: 'frequencies', label: 'Frequências', emoji: '📡' },
    { id: 'chords', label: 'Acordes', emoji: '🎼' },
  ];

  const oitavas = gerarOitavasDaNota(nota.posicaoCromatica, nota.simbolo, [3, 4, 5]);
  const oitavaRef = oitavas.find((o) => o.oitava === getOitavaDestaque(nota.posicaoCromatica));

  // Simple audio
  const playNote = useCallback(() => {
    try {
      const freq = oitavaRef?.frequencia || 440;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
    } catch { /* ignore */ }
  }, [oitavaRef]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-background py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigateTo('/')} className="hover:text-foreground cursor-pointer">Início</button>
            <span>›</span>
            <button onClick={() => navigateTo('/notas')} className="hover:text-foreground cursor-pointer">Notas</button>
            <span>›</span>
            <span className="text-foreground font-semibold">{nota.simboloPortugues}</span>
          </nav>

          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Note visual */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-4 shadow-2xl ${
                nota.teclaTipo === 'branca' ? 'bg-white border-white/50 text-foreground dark:bg-gray-100/10' : 'bg-gray-800 border-gray-600 text-white'
              }`}>
              <span className="text-4xl font-black">{nota.simbolo.split('/')[0]}</span>
              {nota.enarmoniaSimbolo && <span className="text-lg opacity-60">/{nota.enarmoniaSimbolo}</span>}
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{nota.simboloPortugues}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {oitavaRef && (
                  <span className="flex items-center gap-1.5 bg-violet-500/10 rounded-full px-3 py-1 text-sm font-mono text-violet-600 dark:text-violet-300">
                    <Waves className="h-3 w-3" /> {oitavaRef.frequenciaFormatada}
                  </span>
                )}
                <span className="bg-muted rounded-full px-3 py-1 text-sm">
                  {nota.teclaTipo === 'branca' ? '⬜ Natural' : '⬛ Alterada'}
                </span>
                {nota.enarmoniaSimbolo && (
                  <span className="bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-amber-700 dark:text-amber-300 text-sm">
                    ≈ {nota.enarmoniaSimbolo}
                  </span>
                )}
              </div>
              <button onClick={playNote}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition cursor-pointer">
                <Volume2 className="h-4 w-4" /> Ouvir {nota.simbolo.split('/')[0]}4
              </button>
            </div>

            {/* Chromatic position */}
            <div className="hidden lg:flex flex-col gap-1">
              <span className="text-xs text-muted-foreground text-center mb-1">Posição</span>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i === nota.posicaoCromatica ? 'bg-violet-500 scale-150 shadow-lg' : 'bg-muted'}`} />
              ))}
              <span className="text-xs text-muted-foreground text-center mt-1">{nota.posicaoCromatica + 1}/12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Navigator */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {prev ? (
            <button onClick={() => navigateTo(`/nota/${prev.slug}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> {prev.simbolo}
            </button>
          ) : <div />}
          <div className="flex gap-1">
            {NOTAS_DATABASE.map((n) => (
              <button key={n.id} onClick={() => navigateTo(`/nota/${n.slug}`)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                  n.id === nota.id ? 'bg-violet-600 text-white scale-110' : n.teclaTipo === 'branca' ? 'bg-card border border-border hover:border-violet-300' : 'bg-gray-700 text-white hover:bg-violet-700'
                }`}>{n.simbolo.split('/')[0]}</button>
            ))}
          </div>
          {next ? (
            <button onClick={() => navigateTo(`/nota/${next.slug}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              {next.simbolo} <ChevronRight className="h-4 w-4" />
            </button>
          ) : <div />}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  tab === t.id ? 'bg-violet-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
                }`}>{t.emoji} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {tab === 'overview' && <OverviewTab nota={nota} />}
            {tab === 'frequencies' && <FrequencyTab nota={nota} />}
            {tab === 'chords' && <ChordsTab nota={nota} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function OverviewTab({ nota }: { nota: NotaCromatica }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl p-6 border border-violet-500/20">
        <h2 className="font-bold text-violet-700 dark:text-violet-300 mb-2">🎵 Sobre {nota.simboloPortugues}</h2>
        <p className="text-muted-foreground leading-relaxed">{nota.descricao}</p>
      </div>
      <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20">
        <h2 className="font-bold text-amber-700 dark:text-amber-300 mb-2">💡 Curiosidade</h2>
        <p className="text-muted-foreground leading-relaxed">{nota.curiosidade}</p>
      </div>
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="font-bold mb-4">🎯 Usos Comuns</h2>
        <ul className="space-y-2">
          {nota.usoComum.map((uso, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-violet-500 mt-0.5">→</span> {uso}
            </li>
          ))}
        </ul>
      </div>
      {/* Enharmonic */}
      {nota.enarmonia && (
        <div className="bg-card rounded-2xl p-6 border border-amber-500/20">
          <h2 className="font-bold mb-4 flex items-center gap-2"><ArrowLeftRight className="h-5 w-5 text-amber-500" /> Enarmonia</h2>
          <div className="flex items-center justify-center gap-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-2 ${
              nota.teclaTipo === 'branca' ? 'bg-white border-border text-foreground shadow-md' : 'bg-gray-800 border-gray-700 text-white'
            }`}>{nota.simbolo.split('/')[0]}</div>
            <div className="flex flex-col items-center gap-1">
              <ArrowLeftRight className="h-6 w-6 text-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">mesmo som</span>
            </div>
            <button onClick={() => {
              const enNota = NOTAS_DATABASE.find((n) => n.id === nota.enarmonia || n.enarmoniaSimbolo === nota.enarmoniaSimbolo);
              if (enNota) navigateTo(`/nota/${enNota.slug}`);
            }} className="cursor-pointer">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-2 bg-gray-800 border-gray-700 text-white hover:border-amber-400 transition">
                {nota.enarmoniaSimbolo}
              </div>
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            No sistema temperado, <strong>{nota.simbolo.split('/')[0]}</strong> e <strong>{nota.enarmoniaSimbolo}</strong> produzem o mesmo som,
            mas a escolha depende do contexto harmônico.
          </p>
        </div>
      )}
      {/* Chromatic position */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="font-bold mb-4">🎼 Posição na Escala Cromática</h2>
        <div className="flex gap-2 flex-wrap">
          {NOTAS_DATABASE.map((n) => (
            <button key={n.id} onClick={() => navigateTo(`/nota/${n.slug}`)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 text-sm font-bold transition cursor-pointer ${
                n.id === nota.id ? 'bg-violet-600 border-violet-600 text-white scale-110 shadow-lg' :
                n.teclaTipo === 'branca' ? 'bg-white dark:bg-muted border-border hover:border-violet-300' : 'bg-gray-700 border-gray-600 text-white hover:border-violet-400'
              }`}>{n.simbolo.split('/')[0]}</button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Posição: <strong>{nota.posicaoCromatica + 1}</strong>/12 • Tecla <strong>{nota.teclaTipo === 'branca' ? 'Branca' : 'Preta'}</strong>
        </p>
      </div>
    </div>
  );
}

function FrequencyTab({ nota }: { nota: NotaCromatica }) {
  const oitavas = gerarOitavasDaNota(nota.posicaoCromatica, nota.simbolo, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const oitavaEmFoco = getOitavaDestaque(nota.posicaoCromatica);
  const maxFreq = oitavas[oitavas.length - 1]?.frequencia || 1;

  const playFreq = (freq: number) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.5);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      {/* Highlight card */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-violet-200 text-sm">Nota de referência</p>
            <h2 className="text-4xl font-black">{nota.simbolo.split('/')[0]}{oitavaEmFoco}</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">{oitavas.find((o) => o.oitava === oitavaEmFoco)?.frequenciaFormatada}</div>
            {nota.posicaoCromatica === 9 && <span className="text-violet-200 text-sm">🎯 Padrão ISO 440 Hz</span>}
            {nota.posicaoCromatica === 0 && <span className="text-violet-200 text-sm">🎹 Dó central</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-violet-200 text-sm">
          <Waves className="h-4 w-4" /> MIDI {oitavas.find((o) => o.oitava === oitavaEmFoco)?.midi}
        </div>
      </div>

      {/* All octaves */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold">Frequências por Oitava</h3>
          <p className="text-xs text-muted-foreground mt-1">Cada oitava dobra a frequência</p>
        </div>
        <div className="divide-y divide-border">
          {oitavas.map((o) => {
            const isHighlight = o.oitava === oitavaEmFoco;
            const audible = o.frequencia >= 20 && o.frequencia <= 20000;
            return (
              <div key={o.oitava} className={`p-4 relative ${isHighlight ? 'bg-violet-500/5' : 'hover:bg-muted/50'} transition`}>
                <div className="absolute bottom-0 left-0 h-0.5 bg-violet-200 dark:bg-violet-800" style={{ width: `${(o.frequencia / maxFreq) * 100}%` }} />
                <div className="flex items-center gap-4 relative">
                  <span className={`font-mono font-bold text-lg w-12 ${isHighlight ? 'text-violet-700 dark:text-violet-300' : ''}`}>
                    {nota.simbolo.split('/')[0]}{o.oitava}
                  </span>
                  <div className="flex-1">
                    <span className={`font-mono text-base font-semibold ${isHighlight ? 'text-violet-800 dark:text-violet-200' : ''}`}>
                      {o.frequenciaFormatada}
                    </span>
                    {isHighlight && <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full ml-2">referência</span>}
                    {!audible && <span className="text-xs bg-muted px-2 py-0.5 rounded-full ml-2">inaudível</span>}
                    <div className="text-xs text-muted-foreground">{o.descricaoOitava} • MIDI {o.midi}</div>
                  </div>
                  {audible && (
                    <button onClick={() => playFreq(o.frequencia)} className="p-2 rounded-lg text-muted-foreground hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition cursor-pointer">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula */}
      <div className="bg-muted/30 rounded-2xl p-6 border border-border">
        <h3 className="font-bold mb-3">📐 Fórmula</h3>
        <div className="bg-card rounded-xl p-4 font-mono text-sm text-center border border-border">
          <span className="text-violet-600 font-bold">f(n)</span> = <span className="text-green-600">440</span> × <span className="text-orange-600">2</span><sup className="text-orange-600">(n-69)/12</sup>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Onde <code className="bg-muted px-1 rounded">n</code> = número MIDI (A4 = 69). O temperamento igual divide cada oitava em 12 semitons iguais.</p>
      </div>
    </div>
  );
}

function ChordsTab({ nota }: { nota: NotaCromatica }) {
  const rootName = nota.simbolo.split('/')[0];
  const chords = useMemo(() => {
    try {
      return getChordsByRoot(rootName).filter((c) => !c.isSlashChord && !c.isPolychord).slice(0, 20);
    } catch {
      return [];
    }
  }, [rootName]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Music className="h-5 w-5 text-violet-500" /> Acordes com raiz em {rootName}</h3>
        <p className="text-sm text-muted-foreground mb-4">Acordes que começam pela nota {nota.simboloPortugues}.</p>
        {chords.length === 0 ? (
          <p className="text-muted-foreground">Carregando acordes...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {chords.map((chord) => (
              <button key={chord.id} onClick={() => navigateTo(`/acorde/${chord.slug}`)}
                className="p-3 rounded-xl border border-border bg-card hover:border-violet-400 hover:shadow-sm transition cursor-pointer group text-left">
                <div className="font-bold text-lg group-hover:text-violet-600 transition">{chord.symbol}</div>
                <div className="text-[10px] text-muted-foreground truncate">{chord.displayName}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">{chord.notes.map((n) => n.name).join(' · ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="text-center">
        <button onClick={() => navigateTo('/dicionario')} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition cursor-pointer">
          🎼 Ver Dicionário Completo
        </button>
      </div>
    </div>
  );
}
