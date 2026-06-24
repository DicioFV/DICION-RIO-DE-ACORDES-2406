import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Share2, Music, Repeat, Layers, Compass, GraduationCap, Shuffle, ArrowLeftRight, Link2 } from 'lucide-react';
import { getChordPageData } from '@/lib/chord-page/chord-page-data';
import { updateHead, chordSEO } from '@/lib/seo/head-manager';
import { schemaAcorde, schemaHowTo, schemaFAQ } from '@/lib/seo/schema';
import { gerarLinksRelacionados } from '@/lib/seo/internal-links';
import { useChordPageState, type ChordPageInstrument } from '@/hooks/useChordPageState';
import { Piano } from '@/components/instruments/piano/Piano';
import { Fretboard } from '@/components/instruments/fretboard/Fretboard';
import { PlayButton } from '@/components/audio/PlayButton';
import { AudioControls } from '@/components/audio/AudioControls';
import { useFavoritesChords } from '@/hooks/useFavoritesChords';
import { getAllInstruments } from '@/lib/fretboard/instrument-specs';
import { getInversions, applyVoicing, type VoicingType } from '@/lib/music-theory';
import { navigateTo } from '@/hooks/useRouter';
import type { ChordEntry } from '@/data/chords/chord-schema';
import type { Chord } from '@/lib/music-theory/types';

interface Props {
  slug: string;
}

export function ChordPage({ slug }: Props) {
  const data = useMemo(() => getChordPageData(slug), [slug]);

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h1 className="font-extrabold text-3xl mb-3">Acorde não encontrado</h1>
        <p className="text-muted-foreground mb-8">O acorde "{slug}" não existe no dicionário.</p>
        <button onClick={() => navigateTo('/dicionario')}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg transition cursor-pointer">
          Voltar ao dicionário
        </button>
      </div>
    );
  }

  return <ChordPageContent data={data} />;
}

function ChordPageContent({ data }: { data: NonNullable<ReturnType<typeof getChordPageData>> }) {
  const { entry, chord, related, substitutes, enharmonics } = data;
  const { activeInstrument, setInstrument, pedagogicalLevel, setPedagogicalLevel } = useChordPageState();
  const { isFavorite, toggle } = useFavoritesChords();
  const fav = isFavorite(entry.id);
  const fretInstruments = getAllInstruments();
  const seoLinks = useMemo(() => gerarLinksRelacionados(entry.root.name, entry.qualityId), [entry.root.name, entry.qualityId]);

  // Update page head with SEO data
  useEffect(() => {
    const seo = chordSEO(entry.symbol, entry.displayName, entry.notes.map(n => n.name), entry.qualityName);
    const noteNames = entry.notes.map(n => n.name);
    updateHead({
      ...seo,
      schemas: [
        schemaAcorde({ nota: entry.root.name, qualidade: entry.qualityId, simbolo: entry.symbol, notas: noteNames, descricao: entry.shortDescription }),
        schemaHowTo({ simbolo: entry.symbol, notas: noteNames }),
        schemaFAQ({ simbolo: entry.symbol, nota: entry.root.name, qualidade: entry.qualityId, notas: noteNames }),
      ],
    });
  }, [entry]);

  const allTabs: { id: ChordPageInstrument; emoji: string; name: string }[] = [
    { id: 'piano', emoji: '🎹', name: 'Piano' },
    ...fretInstruments.map((i) => ({ id: i.id as ChordPageInstrument, emoji: i.emoji, name: i.shortName })),
  ];

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <button onClick={() => navigateTo('/')} className="hover:text-foreground transition cursor-pointer">Início</button>
        <span>›</span>
        <button onClick={() => navigateTo('/dicionario')} className="hover:text-foreground transition cursor-pointer">Dicionário</button>
        <span>›</span>
        <span className="text-foreground font-semibold">{entry.symbol}</span>
      </nav>

      {/* Back button */}
      <button onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {/* HEADER */}
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="font-extrabold text-6xl md:text-8xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-none">
            {entry.symbol}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold">{entry.displayName}</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{entry.shortDescription}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {entry.notes.map((n, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                  i === 0 ? 'bg-[#f59e0b] text-black' : 'bg-primary/15 text-primary'
                }`}>{n.name}</span>
              ))}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-muted text-muted-foreground ml-2">{entry.complexity}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <PlayButton chord={chord} size="xl" />
            <div className="flex gap-1">
              <button onClick={() => toggle(entry.id)}
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary transition flex items-center justify-center cursor-pointer">
                <Star className={`h-4 w-4 ${fav ? 'fill-accent text-accent' : ''}`} />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary transition flex items-center justify-center cursor-pointer">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        {entry.styles.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {entry.styles.map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground capitalize">#{s}</span>)}
          </div>
        )}
      </motion.header>

      {/* INSTRUMENT TABS */}
      <div className="mb-6 flex items-center gap-1 p-1 rounded-xl bg-muted overflow-x-auto">
        {allTabs.map((tab) => (
          <button key={tab.id} onClick={() => setInstrument(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap cursor-pointer ${
              activeInstrument === tab.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>
            <span className="text-lg">{tab.emoji}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* INSTRUMENT VIEW */}
      <div className="mb-12">
        {activeInstrument === 'piano' ? (
          <Piano chord={chord} />
        ) : (
          <Fretboard chord={chord} defaultInstrument={activeInstrument} key={activeInstrument} />
        )}
      </div>

      {/* SECTIONS */}
      <div className="space-y-12">
        {/* Formation */}
        <Section title="Formação do Acorde" icon={<Music className="h-5 w-5 text-primary" />}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Notas</div>
              <div className="flex gap-2 flex-wrap">
                {entry.notes.map((n, i) => (
                  <div key={i} className="text-center">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${
                      i === 0 ? 'bg-[#f59e0b] text-black' : 'bg-primary/15 text-primary'
                    }`}>{n.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{i === 0 ? 'Fund.' : `${i + 1}ª`}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Intervalos</div>
              <div className="space-y-2">
                {entry.intervals.map((iv, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary w-10">{iv.shortName}</span>
                    <span className="text-sm text-muted-foreground flex-1">{iv.name}</span>
                    <span className="text-xs text-muted-foreground">{iv.semitones} st</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Inversions */}
        <Section title="Inversões" icon={<Repeat className="h-5 w-5 text-primary" />}>
          <InversionsGrid chord={chord} />
        </Section>

        {/* Voicings */}
        <Section title="Voicings" icon={<Layers className="h-5 w-5 text-primary" />}>
          <VoicingsGrid chord={chord} />
        </Section>

        {/* Harmonic Function */}
        {(entry.functions.length > 0 || entry.commonKeys.length > 0) && (
          <Section title="Função Harmônica" icon={<Compass className="h-5 w-5 text-primary" />}>
            <div className="grid md:grid-cols-2 gap-4">
              {entry.functions.length > 0 && (
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Funções</div>
                  <ul className="space-y-2">
                    {entry.functions.slice(0, 5).map((fn, i) => (
                      <li key={i} className="text-sm"><span className="font-mono font-bold text-primary">{fn.split(' de ')[0]}</span> de <span className="font-semibold">{fn.split(' de ')[1]}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.commonKeys.length > 0 && (
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Tonalidades</div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.commonKeys.slice(0, 12).map((k) => (
                      <span key={k} className="px-2.5 py-1 rounded-md bg-muted font-mono text-xs font-semibold">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Pedagogical */}
        <Section title="Guia Pedagógico" icon={<GraduationCap className="h-5 w-5 text-primary" />}>
          <PedagogicalContent entry={entry} level={pedagogicalLevel} setLevel={setPedagogicalLevel} />
        </Section>

        {/* Substitutes */}
        {substitutes.length > 0 && (
          <Section title="Substituições" icon={<Shuffle className="h-5 w-5 text-primary" />}>
            <div className="space-y-2">
              {substitutes.map((s, i) => (
                <button key={i} onClick={() => navigateTo(`/acorde/${s.chord.slug}`)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary transition cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg group-hover:text-primary transition">{s.chord.symbol}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.explanation}</p>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Enharmonics */}
        {enharmonics.length > 0 && (
          <Section title="Enarmônicos" icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}>
            <div className="flex flex-wrap gap-3">
              {enharmonics.map((e) => (
                <button key={e.id} onClick={() => navigateTo(`/acorde/${e.slug}`)}
                  className="px-4 py-3 rounded-xl border border-border bg-card hover:border-primary transition cursor-pointer">
                  <span className="font-bold text-xl">{e.symbol}</span>
                  <span className="text-xs text-muted-foreground ml-2">≡ {entry.symbol}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <Section title="Acordes Relacionados" icon={<Link2 className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {related.map((c) => (
                <button key={c.id} onClick={() => navigateTo(`/acorde/${c.slug}`)}
                  className="p-3 rounded-xl border border-border bg-card hover:border-primary hover:shadow-sm transition cursor-pointer group text-left">
                  <div className="font-bold text-lg group-hover:text-primary transition">{c.symbol}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{c.displayName}</div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* SEO Internal Links */}
        {seoLinks.length > 0 && (
          <Section title="Explorar Mais" icon={<Link2 className="h-5 w-5 text-secondary" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {seoLinks.filter(l => l.tipo !== 'exercicio').map((l, i) => (
                <button key={i} onClick={() => { window.location.hash = l.href.replace('#', ''); }}
                  className="p-3 rounded-xl border border-border bg-card hover:border-secondary hover:shadow-sm transition cursor-pointer group text-left">
                  <div className="font-bold text-sm group-hover:text-secondary transition font-mono">{l.texto}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{l.descricao}</div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Audio Controls */}
        <AudioControls />
      </div>
    </article>
  );
}

// ======================== Sub-components ========================

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4">{icon}{title}</h2>
      {children}
    </section>
  );
}

function InversionsGrid({ chord }: { chord: Chord }) {
  const inversions = getInversions(chord);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {inversions.map((inv, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">{i === 0 ? 'Fundamental' : `${i}ª Inversão`}</span>
            <PlayButton chord={chord} inversion={i} size="sm" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {inv.notes.map((n, j) => (
              <span key={j} className={`px-2 py-1 rounded font-mono text-xs font-bold ${j === 0 ? 'bg-secondary/20 text-secondary' : 'bg-primary/15 text-primary'}`}>{n.name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const VOICINGS: { id: string; name: string; desc: string }[] = [
  { id: 'close', name: 'Fechado', desc: 'Notas próximas' },
  { id: 'open', name: 'Aberto', desc: 'Espalhado' },
  { id: 'drop2', name: 'Drop 2', desc: 'Jazz' },
  { id: 'drop3', name: 'Drop 3', desc: 'Encorpado' },
  { id: 'spread', name: 'Spread', desc: 'Máxima abertura' },
];

function VoicingsGrid({ chord }: { chord: Chord }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {VOICINGS.map((v) => {
        let processed;
        try { processed = applyVoicing(chord, v.id as VoicingType, 4); } catch { return null; }
        if (!processed.pitches) return null;
        return (
          <div key={v.id} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div><div className="font-semibold text-sm">{v.name}</div><div className="text-xs text-muted-foreground">{v.desc}</div></div>
              <PlayButton chord={chord} voicing={v.id} size="sm" />
            </div>
            <div className="flex gap-1 flex-wrap mt-2">
              {processed.pitches.map((p, i) => (
                <span key={i} className="px-2 py-1 rounded font-mono text-[10px] bg-muted">{p.note.name}{p.octave}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PedagogicalContent({ entry, level, setLevel }: { entry: ChordEntry; level: string; setLevel: (l: 'beginner' | 'intermediate' | 'advanced') => void }) {
  const levels = [
    { id: 'beginner' as const, label: 'Iniciante', emoji: '🌱' },
    { id: 'intermediate' as const, label: 'Intermediário', emoji: '🎯' },
    { id: 'advanced' as const, label: 'Avançado', emoji: '🏆' },
  ];

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-muted mb-4">
        {levels.map((l) => (
          <button key={l.id} onClick={() => setLevel(l.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${level === l.id ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
            {l.emoji} {l.label}
          </button>
        ))}
      </div>
      <div className="p-6 rounded-xl border border-border bg-card text-sm leading-relaxed space-y-4">
        {level === 'beginner' && (
          <>
            <div><h4 className="font-bold mb-2">O que é o acorde {entry.symbol}?</h4>
              <p className="text-muted-foreground">{entry.shortDescription} Formado por {entry.notes.length} notas: {entry.notes.map((n) => n.name).join(', ')}.</p></div>
            <div><h4 className="font-bold mb-2">Passo a passo</h4>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Comece pela nota <strong>{entry.notes[0].name}</strong> (fundamental).</li>
                {entry.notes.slice(1).map((n, i) => <li key={i}>Adicione <strong>{n.name}</strong>.</li>)}
              </ol></div>
          </>
        )}
        {level === 'intermediate' && (
          <>
            <p className="text-muted-foreground">{entry.longDescription || entry.shortDescription}</p>
            {entry.usageExamples && entry.usageExamples.length > 0 && (
              <div><h4 className="font-bold mb-2">Exemplos</h4>
                <ul className="list-disc list-inside text-muted-foreground">{entry.usageExamples.map((ex, i) => <li key={i}>{ex}</li>)}</ul></div>
            )}
          </>
        )}
        {level === 'advanced' && (
          <>
            <p className="text-muted-foreground">Funções: {entry.functions.slice(0, 3).map((fn) => fn).join(', ')}.</p>
            <p className="text-muted-foreground">Explore voicings rootless e drop 2/3. Considere substituição por trítono ou empréstimo modal.</p>
          </>
        )}
      </div>
    </div>
  );
}
