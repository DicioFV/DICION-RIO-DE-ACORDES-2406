import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lock, ChevronRight, Download, Award } from 'lucide-react';
import { APOSTILAS, TOTAL_PAGINAS, type NivelApostila } from '@/lib/apostilas/config';
import { usePlano } from '@/hooks/usePlano';
import { temAcesso, type PlanoId } from '@/lib/planos/config';
import { navigateTo } from '@/hooks/useRouter';

const PLANO_BADGE: Record<string, string> = { gratis: '🆓 Grátis', pro: '⭐ PRO', master: '💎 Master', premium: '👑 Premium' };

export function WorkbooksPage() {
  const { plano } = usePlano();
  const acessiveis = APOSTILAS.filter((a) => temAcesso(plano as PlanoId, a.planMinimo as PlanoId)).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/20 via-accent/10 to-background py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
            Apostilas de{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Luxo</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            12 volumes progressivos — do fundamentos ao mestre. <strong>{TOTAL_PAGINAS}+ páginas</strong> de harmonia musical profissional.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { v: '12', l: 'Volumes' }, { v: `${TOTAL_PAGINAS}+`, l: 'Páginas' },
              { v: `${acessiveis}`, l: 'Disponíveis' }, { v: 'QR', l: 'Certificados' },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.entries(PLANO_BADGE).map(([id, label]) => (
            <span key={id} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted">{label}</span>
          ))}
          <span className="text-xs text-muted-foreground self-center ml-1">= plano mínimo</span>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-4">
        {APOSTILAS.map((apostila, idx) => {
          const hasAccess = temAcesso(plano as PlanoId, apostila.planMinimo as PlanoId);
          return (
            <motion.div key={apostila.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
              <WorkbookCard apostila={apostila} hasAccess={hasAccess} />
            </motion.div>
          );
        })}

        {acessiveis < 12 && (
          <div className="mt-8 bg-gradient-to-r from-accent to-primary rounded-2xl p-6 text-center">
            <h3 className="font-black text-white text-xl mb-2">Acesse todas as 12 apostilas com Premium 👑</h3>
            <p className="text-white/80 text-sm mb-4">{TOTAL_PAGINAS}+ páginas, certificados com QR code. R$ 29,90/mês.</p>
            <button onClick={() => navigateTo('/planos')}
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition cursor-pointer">
              Ver planos <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkbookCard({ apostila, hasAccess }: { apostila: NivelApostila; hasAccess: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-card rounded-2xl border overflow-hidden transition ${hasAccess ? 'border-border hover:border-primary/40 hover:shadow-lg' : 'border-border opacity-75'}`}>
      <div className="flex items-start gap-4 p-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg bg-gradient-to-br ${apostila.cor}`}>
          {apostila.numero < 10 ? `0${apostila.numero}` : apostila.numero}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-black text-lg">{apostila.emoji} {apostila.titulo}</h3>
            {!hasAccess && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{apostila.subtitulo}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground">📄 {apostila.paginas} págs</span>
            <span className="text-xs text-muted-foreground">📚 {apostila.topicos.length} tópicos</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hasAccess ? 'bg-green-500/15 text-green-600 dark:text-green-300' : 'bg-muted'}`}>
              {hasAccess ? '✓ Disponível' : PLANO_BADGE[apostila.planMinimo]}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {hasAccess ? (
            <>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl cursor-pointer hover:bg-primary/90">
                <Download className="h-3 w-3" /> PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-xl cursor-pointer hover:bg-accent/90">
                <Award className="h-3 w-3" /> Certificado
              </button>
            </>
          ) : (
            <button onClick={() => navigateTo('/planos')}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-accent to-primary text-white text-xs font-bold rounded-xl cursor-pointer">
              🔓 Desbloquear
            </button>
          )}
        </div>
      </div>

      {/* Expandable topics */}
      <div className="border-t border-border">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer">
          <span>Ver conteúdo</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground mb-3">{apostila.descricao}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                  {apostila.topicos.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 bg-gradient-to-br ${apostila.cor}`}>{i + 1}</span>
                      <span className="text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>
                {apostila.acordesExemplo.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">Acordes abordados:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {apostila.acordesExemplo.map((a) => (
                        <button key={a} onClick={() => navigateTo(`/acorde/${a.toLowerCase()}-maior`)}
                          className="px-2 py-0.5 bg-muted rounded text-xs font-mono hover:bg-primary/10 hover:text-primary transition cursor-pointer">{a}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
