import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2 } from 'lucide-react';

interface Props { onInstalar: () => Promise<void>; onDispensar: () => void; isIOS: boolean; }

export function InstallPrompt({ onInstalar, onDispensar, isIOS }: Props) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed && (Date.now() - Number(dismissed)) < 7 * 86400000) return;
    const t = setTimeout(() => setVisivel(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!visivel) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🎼</div>
                <div><p className="font-bold text-white text-sm">MusicVerse Chords</p><p className="text-white/70 text-xs">Instalar como app</p></div>
              </div>
              <button onClick={() => { setVisivel(false); onDispensar(); }} className="text-white/70 hover:text-white p-1 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="p-4">
            {isIOS ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">Instale no seu iPhone:</p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">1</span> Toque em <Share2 className="h-3.5 w-3.5 text-blue-500 inline" /> Compartilhar</li>
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">2</span> "Adicionar à Tela de Início"</li>
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">3</span> Toque em "Adicionar" ✓</li>
                </ol>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">Acesso rápido, offline e sem navegador.</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {[{ e: '📶', l: 'Offline' }, { e: '⚡', l: 'Rápido' }, { e: '🎵', l: 'Grátis' }].map(({ e, l }) => (
                    <div key={l} className="bg-muted rounded-xl p-2"><div className="text-2xl">{e}</div><div className="text-xs text-muted-foreground mt-0.5">{l}</div></div>
                  ))}
                </div>
                <button onClick={async () => { await onInstalar(); setVisivel(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer">
                  <Download className="h-4 w-4" /> Instalar — Gratuito
                </button>
              </div>
            )}
            <button onClick={() => { setVisivel(false); onDispensar(); }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-2 py-1 cursor-pointer">Não, obrigado</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
