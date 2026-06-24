import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import { PLANOS, type PlanoId } from '@/lib/planos/config';
import { usePlano } from '@/hooks/usePlano';

const VISIBLE_PLANS: PlanoId[] = ['gratis', 'pro', 'master', 'premium'];

export function PlansPage() {
  const [periodo, setPeriodo] = useState<'mensal' | 'anual'>('mensal');
  const { plano: planoAtual, setPlano } = usePlano();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
            Escolha seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">plano</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Desbloqueie todos os acordes, instrumentos, exercícios e muito mais.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${periodo === 'mensal' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
          <button onClick={() => setPeriodo(p => p === 'mensal' ? 'anual' : 'mensal')}
            className={`relative w-12 h-6 rounded-full transition ${periodo === 'anual' ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${periodo === 'anual' ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${periodo === 'anual' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Anual <span className="ml-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">-25%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VISIBLE_PLANS.map((planId, idx) => {
            const plan = PLANOS[planId];
            const price = periodo === 'anual' && plan.precoAnual
              ? (plan.precoAnual / 12).toFixed(2).replace('.', ',')
              : plan.preco.toFixed(2).replace('.', ',');
            const isCurrent = planoAtual === planId;

            return (
              <motion.div key={planId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className={`relative bg-card rounded-2xl border overflow-hidden ${plan.destaque ? 'border-primary shadow-2xl shadow-primary/20 scale-105' : 'border-border'}`}>
                {plan.destaque && <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1">⭐ MAIS POPULAR</div>}
                <div className={`bg-gradient-to-r ${plan.cor} p-5 ${plan.destaque ? '' : ''}`}>
                  <div className="text-2xl mb-1">{plan.emoji}</div>
                  <h3 className="font-black text-white text-xl">{plan.nome}</h3>
                  <p className="text-white/70 text-xs">{plan.descricao}</p>
                  <div className="mt-3">
                    {plan.preco === 0
                      ? <span className="text-3xl font-black text-white">Grátis</span>
                      : <><span className="text-3xl font-black text-white">R$ {price}</span><span className="text-white/70 text-sm">/mês</span></>
                    }
                    {periodo === 'anual' && plan.precoAnual && (
                      <div className="text-xs text-white/60 mt-0.5">R$ {plan.precoAnual.toFixed(2).replace('.', ',')} /ano</div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <ul className="space-y-2 mb-5">
                    {plan.recursos.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        {r.incluido ? <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" /> : <X className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />}
                        <span className={r.incluido ? 'text-foreground' : 'text-muted-foreground/50'}>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.preco > 0 && <div className="flex items-center gap-1.5 text-xs text-accent mb-3"><Zap className="h-3 w-3" /> 7 dias grátis</div>}
                  <button onClick={() => setPlano(planId)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      isCurrent ? 'bg-muted text-muted-foreground cursor-not-allowed' : `bg-gradient-to-r ${plan.cor} text-white hover:opacity-90 shadow-lg`
                    }`}>
                    {isCurrent ? '✓ Seu plano atual' : plan.preco === 0 ? 'Começar Grátis' : `Assinar ${plan.nome}`}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-8">
          🎓 Professor? O plano Aluno VIP oferece acesso completo gratuito por 12 meses para seus alunos.
        </p>
      </div>
    </div>
  );
}
