import { motion } from 'framer-motion';
import { Music, Piano, Headphones, BookOpen, GraduationCap, Search, Smartphone, Star, Award, Heart } from 'lucide-react';
import { navigateTo } from '@/hooks/useRouter';

const FUNCIONALIDADES = [
  {
    icon: BookOpen, title: 'Dicionário de 1.000+ Acordes', color: 'from-indigo-500 to-blue-600',
    items: [
      '42 qualidades de acorde (tríades, tétrades, extensões, alterados)',
      '12 tonalidades cromáticas com enarmônicos',
      'Página individual com 10 seções por acorde',
      'Inversões, voicings, função harmônica, substituições',
      'Guia pedagógico em 3 níveis (Iniciante / Intermediário / Avançado)',
      'Acordes relacionados e enarmônicos cruzados',
    ],
    cta: { label: 'Explorar Acordes', href: '#/dicionario' },
  },
  {
    icon: Piano, title: '7 Instrumentos Virtuais', color: 'from-violet-500 to-purple-600',
    items: [
      'Piano SVG responsivo com 4 tamanhos de teclado',
      'Violão, Guitarra, Ukulele, Cavaquinho e Bandolim',
      'Sistema CAGED com até 5 posições por acorde',
      'Detecção automática de pestanas e dedilhado',
      '11 afinações (Standard, Drop D, Open G, DADGAD...)',
      'Modo canhoto completo em todos os instrumentos',
    ],
    cta: { label: 'Tocar Piano', href: '#/piano' },
  },
  {
    icon: Headphones, title: 'Áudio Profissional', color: 'from-green-500 to-emerald-600',
    items: [
      '13 timbres: Piano, Rhodes, Violão, Guitarra, Ukulele, Cordas...',
      '6 modos: Bloco, Arpejo ↑↓, Sobe/Desce, Rasgueio ↑↓',
      'Controle de volume, velocidade, sustain',
      'Samples reais via Tone.js (não MIDI sintético)',
      'Botão de play em cada acorde, inversão e voicing',
    ],
    cta: { label: 'Ouvir Demos', href: '#/audio' },
  },
  {
    icon: Music, title: 'Dicionário de 12 Notas', color: 'from-pink-500 to-rose-600',
    items: [
      'As 12 notas cromáticas com descrição e curiosidades',
      'Frequências em Hz por oitava (C0 a C8)',
      'Posição em cada instrumento',
      'Enarmonia explicada visualmente',
      'Teclado interativo clicável',
      'Botão de play para ouvir cada nota/oitava',
    ],
    cta: { label: 'Ver Notas', href: '#/notas' },
  },
  {
    icon: GraduationCap, title: '710+ Exercícios Gamificados', color: 'from-amber-500 to-orange-600',
    items: [
      '6 módulos: Reconhecimento Visual, Intervalos, Inversões, Voicings, Função Harmônica, Progressões',
      '5 níveis de dificuldade (Iniciante → Mestre)',
      'Sistema de XP com 10 níveis e títulos',
      '13 conquistas (Comum → Lendário)',
      'Streak diário de estudo',
      'Modos Treino (com dicas) e Desafio (cronometrado)',
      'Mnemônicos com músicas famosas para intervalos',
    ],
    cta: { label: 'Começar a Treinar', href: '#/exercicios' },
  },
  {
    icon: Search, title: 'Busca Inteligente', color: 'from-cyan-500 to-teal-600',
    items: [
      'Autocomplete em menos de 50ms',
      'Entende português: "do menor setima" → Cm7',
      'Entende variantes: CΔ7 = CM7 = Cmaj7',
      'Busca por notas: "C E G B" → Cmaj7',
      'Histórico de buscas + sugestões populares',
      'Atalho de teclado: / para focar na busca',
    ],
    cta: { label: 'Buscar', href: '#/dicionario' },
  },
  {
    icon: BookOpen, title: 'Glossário Musical (30+ Termos)', color: 'from-violet-500 to-indigo-600',
    items: [
      '7 categorias: Notas, Intervalos, Acordes, Função Harmônica, Escalas, Estilos, Teoria Avançada',
      'Definição simples + completa para cada termo',
      'Exemplos musicais e músicas famosas',
      'Curiosidades históricas',
      'Filtro por nível e categoria',
      'Busca em tempo real',
    ],
    cta: { label: 'Abrir Glossário', href: '#/glossario' },
  },
  {
    icon: Award, title: '12 Apostilas de Luxo em PDF', color: 'from-yellow-500 to-amber-600',
    items: [
      '1.550+ páginas de harmonia do básico ao avançado',
      'Diagramas de acordes gerados automaticamente',
      'Marca d\'água personalizada com nome do aluno',
      'Certificado de conclusão com QR Code',
      '12 volumes progressivos',
      'Capa e sumário profissionais',
    ],
    cta: { label: 'Ver Apostilas', href: '#/apostilas' },
  },
  {
    icon: Smartphone, title: 'PWA e Modo Offline', color: 'from-slate-500 to-gray-600',
    items: [
      'Instalável como app (Android, iOS, Desktop)',
      'Funciona offline após primeira visita',
      'Banner de instalação inteligente',
      'Detecção automática de conexão',
      'Touch otimizado para mobile',
      'Tema claro/escuro automático',
    ],
    cta: { label: 'Página Inicial', href: '#/' },
  },
  {
    icon: Star, title: '5 Planos de Assinatura', color: 'from-blue-500 to-indigo-600',
    items: [
      '🆓 Grátis: tríades, 1 instrumento, exercícios básicos',
      '⭐ PRO (R$9,90): todos os acordes e instrumentos',
      '💎 Master (R$17,90): voicings, progressões, exercícios mestre',
      '👑 Premium (R$29,90): tudo + áudio HD + apostilas completas',
      '🎓 Aluno VIP: acesso total gratuito por 12 meses',
      'Desconto de 25% no plano anual',
    ],
    cta: { label: 'Ver Planos', href: '#/planos' },
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/20 via-accent/10 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">🎼</div>
            <h1 className="font-extrabold text-4xl md:text-6xl tracking-tight mb-4">
              Tudo o que o{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                MusicVerse Chords
              </span>
              {' '}oferece
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A plataforma mais completa do Brasil para aprender, consultar e praticar harmonia musical.
              Veja abaixo todas as funcionalidades disponíveis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {FUNCIONALIDADES.map((feat, idx) => (
          <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition">
            <div className={`bg-gradient-to-r ${feat.color} p-5 flex items-center gap-4`}>
              <feat.icon className="h-8 w-8 text-white shrink-0" />
              <h2 className="font-extrabold text-white text-xl">{feat.title}</h2>
            </div>
            <div className="p-5">
              <ul className="grid sm:grid-cols-2 gap-2 mb-4">
                {feat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigateTo(feat.cta.href.replace('#', ''))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition cursor-pointer">
                {feat.cta.label} →
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <Heart className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="font-extrabold text-3xl mb-3">Feito para músicos, por músicos</h2>
          <p className="text-muted-foreground mb-8">
            21 blocos de desenvolvimento, 155 arquivos, 3.276 módulos, 1.050+ KB de funcionalidade pura.
            Tudo isso rodando no seu navegador, sem instalar nada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigateTo('/dicionario')}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold cursor-pointer hover:bg-primary/90 transition">
              Explorar Agora
            </button>
            <button onClick={() => navigateTo('/planos')}
              className="px-6 py-3 rounded-xl border border-border font-bold cursor-pointer hover:bg-muted transition">
              Ver Planos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
