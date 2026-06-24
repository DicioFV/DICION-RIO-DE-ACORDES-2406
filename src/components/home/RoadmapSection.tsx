import { motion } from 'framer-motion';
import { Check, Clock, Lock } from 'lucide-react';

interface Block {
  number: string;
  title: string;
  status: 'done' | 'current' | 'upcoming';
}

const blocks: Block[] = [
  { number: '01', title: 'Fundação & Arquitetura', status: 'done' },
  { number: '02', title: 'Motor Teórico Musical', status: 'done' },
  { number: '03', title: 'Banco de Acordes', status: 'done' },
  { number: '04', title: 'Busca Inteligente', status: 'done' },
  { number: '05', title: 'Visualização Piano', status: 'done' },
  { number: '06', title: 'Visualização Cordas', status: 'done' },
  { number: '07', title: 'Uke, Cavaco & Bandolim', status: 'done' },
  { number: '08', title: 'Motor de Áudio', status: 'done' },
  { number: '09', title: 'Página de Acorde', status: 'done' },
  { number: '10', title: 'Dicionário Completo', status: 'done' },
  { number: '11', title: 'Dicionário de Notas', status: 'done' },
  { number: '12', title: 'Exercícios & Gamificação', status: 'done' },
  { number: '13', title: 'Reconhecimento Visual', status: 'done' },
  { number: '14', title: 'Exercícios Intervalos', status: 'done' },
  { number: '15', title: 'Exercícios Avançados', status: 'done' },
  { number: '16', title: 'Pedagogia & Glossário', status: 'done' },
  { number: '17', title: 'SEO & Conteúdo', status: 'done' },
  { number: '18', title: 'PWA & Mobile', status: 'done' },
  { number: '19', title: 'Polimento & A11y', status: 'done' },
  { number: '20', title: 'Planos & Auth', status: 'done' },
  { number: '21', title: 'Apostilas de Luxo', status: 'done' },
];

const statusConfig = {
  done: {
    bg: 'bg-primary text-primary-foreground',
    icon: Check,
  },
  current: {
    bg: 'bg-accent text-accent-foreground',
    icon: Clock,
  },
  upcoming: {
    bg: 'bg-muted text-muted-foreground',
    icon: Lock,
  },
};

export function RoadmapSection() {
  const completed = blocks.filter((b) => b.status === 'done').length;
  const percent = Math.round((completed / blocks.length) * 100);

  return (
    <section id="sobre" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-8 sm:p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🚀</span>
                <h3 className="font-extrabold text-2xl sm:text-3xl">
                  Construção em andamento
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                Este é o{' '}
                <strong className="text-foreground">
                  Bloco 01 — Fundação e Arquitetura
                </strong>{' '}
                de um projeto de 20 blocos. Estrutura, design system, PWA e SEO
                técnico já estão prontos.
              </p>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">
                    Progresso Global
                  </span>
                  <span className="text-sm font-bold text-primary">{percent}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Blocks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {blocks.map((block) => {
                  const config = statusConfig[block.status];
                  const Icon = config.icon;
                  return (
                    <div
                      key={block.number}
                      className={`relative p-3 rounded-xl text-center text-xs font-medium transition-all ${config.bg}`}
                    >
                      <Icon className="h-3.5 w-3.5 mx-auto mb-1 opacity-70" />
                      <div className="font-bold">Bloco {block.number}</div>
                      <div className="opacity-70 mt-0.5 text-[10px] leading-tight">
                        {block.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
