import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Waves, ChevronRight } from 'lucide-react';
import { NOTAS_DATABASE, type NotaCromatica } from '@/lib/notas/database';
import { gerarOitavasDaNota } from '@/lib/notas/frequencias';
import { navigateTo } from '@/hooks/useRouter';

export function NotesPage() {
  const [filtro, setFiltro] = useState<'todas' | 'naturais' | 'alteradas'>('todas');

  const notasFiltradas = NOTAS_DATABASE.filter((n) => {
    if (filtro === 'naturais') return n.teclaTipo === 'branca';
    if (filtro === 'alteradas') return n.teclaTipo === 'preta';
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-background py-16 sm:py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-600 dark:text-violet-300 mb-6">
            <Music className="h-3.5 w-3.5" /> Dicionário de Notas
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-extrabold text-4xl md:text-6xl tracking-tight mb-4">
            As{' '}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">12 Notas</span>
            {' '}Musicais
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Explore cada nota da escala cromática: posições nos instrumentos, frequências em Hz, enarmonias e muito mais.
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8">
            {[
              { v: '12', l: 'Cromáticas', e: '🎵' },
              { v: '7', l: 'Naturais', e: '⬜' },
              { v: '5', l: 'Alteradas', e: '⬛' },
              { v: '440', l: 'Hz (Lá4)', e: '📡' },
            ].map(({ v, l, e }) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold">{e} {v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Keyboard */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-b from-card to-muted/30 rounded-2xl border border-border p-6 overflow-x-auto">
          <div className="relative flex gap-1 min-w-max mx-auto w-fit">
            {NOTAS_DATABASE.filter((n) => n.teclaTipo === 'branca').map((nota) => (
              <button key={nota.id} onClick={() => navigateTo(`/nota/${nota.slug}`)}
                className="relative flex flex-col items-center justify-end pb-3 w-14 h-40 bg-key-white dark:bg-gray-100/10 rounded-b-xl border border-border hover:bg-violet-50 dark:hover:bg-violet-950 transition group shadow-md cursor-pointer">
                <span className="text-xs font-bold text-muted-foreground group-hover:text-violet-600">{nota.simbolo}</span>
                <span className="text-[10px] text-muted-foreground/60">{nota.simboloPortugues.split('/')[0].split(' ')[0]}</span>
              </button>
            ))}
            {/* Black keys positioned absolutely */}
            {[
              { id: 'Db', left: 0.7 }, { id: 'Eb', left: 1.7 },
              { id: 'F#', left: 3.7 }, { id: 'Ab', left: 4.7 }, { id: 'Bb', left: 5.7 },
            ].map(({ id, left }) => {
              const nota = NOTAS_DATABASE.find((n) => n.id === id);
              if (!nota) return null;
              return (
                <button key={id} onClick={() => navigateTo(`/nota/${nota.slug}`)}
                  style={{ left: `${left * 60}px` }}
                  className="absolute top-0 z-10 flex flex-col items-center justify-end pb-2 w-9 h-24 bg-key-black rounded-b-lg hover:bg-violet-800 transition group shadow-xl cursor-pointer">
                  <span className="text-[9px] font-bold text-white/60 group-hover:text-white">{id}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">Clique em qualquer nota para ver detalhes</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Mostrar:</span>
          {[
            { id: 'todas', label: 'Todas (12)', count: 12 },
            { id: 'naturais', label: '⬜ Naturais (7)', count: 7 },
            { id: 'alteradas', label: '⬛ Alteradas (5)', count: 5 },
          ].map((op) => (
            <button key={op.id} onClick={() => setFiltro(op.id as typeof filtro)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                filtro === op.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-card border border-border hover:border-violet-300'
              }`}>{op.label}</button>
          ))}
        </div>
      </section>

      {/* Notes Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notasFiltradas.map((nota, idx) => (
            <motion.div key={nota.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}>
              <NoteCard nota={nota} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pedagogical */}
      <section className="bg-muted/30 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-10">Entendendo as Notas Musicais</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { e: '🎵', t: 'Escala Cromática', d: 'Contém as 12 notas possíveis no sistema temperado, divididas em semitons iguais.' },
              { e: '🔄', t: 'Enarmonia', d: 'Quando duas notas têm o mesmo som mas nomes diferentes. C# e Db soam igual no piano.' },
              { e: '📡', t: 'Frequência (Hz)', d: 'Hz mede vibrações por segundo. A4 = 440 Hz. Dobrar a frequência = subir uma oitava.' },
            ].map(({ e, t, d }) => (
              <div key={t} className="bg-card rounded-2xl p-6 border border-border">
                <div className="text-4xl mb-3">{e}</div>
                <h3 className="font-bold mb-2">{t}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NoteCard({ nota }: { nota: NotaCromatica }) {
  const oitavas = gerarOitavasDaNota(nota.posicaoCromatica, nota.simbolo, [4]);
  const oitavaRef = oitavas[0];

  return (
    <button onClick={() => navigateTo(`/nota/${nota.slug}`)}
      className="w-full text-left bg-card rounded-2xl border border-border p-5 hover:border-violet-400 hover:shadow-lg transition group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl text-2xl font-black mb-2 border-2 ${
            nota.teclaTipo === 'branca'
              ? 'bg-white border-border text-foreground shadow-md dark:bg-gray-100/10'
              : 'bg-gray-800 border-gray-700 text-white shadow-lg'
          }`}>{nota.simbolo.split('/')[0]}</div>
          <div>
            <h3 className="font-bold group-hover:text-violet-600 transition">{nota.simboloPortugues}</h3>
            <span className="text-xs text-muted-foreground">
              {nota.tipo === 'natural' ? '⬜ Natural' : nota.tipo === 'sustenido' ? '♯ Sustenido' : '♭ Bemol'}
            </span>
          </div>
        </div>
        {oitavaRef && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
              <Waves className="h-3 w-3" />
              <span className="text-xs font-mono font-semibold">{oitavaRef.frequenciaFormatada}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{nota.simbolo.split('/')[0]}4</span>
          </div>
        )}
      </div>
      {nota.enarmonia && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Enarmonia:</span>
          <span className="text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
            {nota.simbolo.split('/')[0]} = {nota.enarmoniaSimbolo}
          </span>
        </div>
      )}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i === nota.posicaoCromatica ? 'bg-violet-500' : 'bg-muted'}`} />
        ))}
      </div>
      <div className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 gap-1 group-hover:gap-2 transition-all">
        Ver detalhes <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
