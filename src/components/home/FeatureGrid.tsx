import { motion } from 'framer-motion';
import {
  Music4,
  BookOpen,
  Headphones,
  Layers,
  Zap,
  Smartphone,
  Globe,
  GraduationCap,
} from 'lucide-react';

const features = [
  {
    icon: Music4,
    title: '2.000+ Acordes',
    description:
      'Biblioteca completa de acordes para 6 instrumentos com notação profissional.',
    color: 'from-primary to-purple-600',
  },
  {
    icon: Headphones,
    title: 'Áudio Profissional',
    description:
      'Samples de piano Salamander em qualidade de estúdio com Tone.js.',
    color: 'from-secondary to-blue-600',
  },
  {
    icon: Layers,
    title: 'Inversões & Voicings',
    description:
      'Todas as inversões e voicings possíveis com visualização interativa.',
    color: 'from-accent to-orange-600',
  },
  {
    icon: BookOpen,
    title: 'Teoria Aplicada',
    description:
      'Entenda a formação de cada acorde com intervalos, graus e fórmulas.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: Zap,
    title: 'Ultra Rápido',
    description:
      'Busca instantânea e navegação fluida com renderização otimizada.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: GraduationCap,
    title: 'Exercícios Interativos',
    description:
      'Pratique identificação de acordes, intervalos e progressões harmônicas.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Smartphone,
    title: 'PWA Nativo',
    description:
      'Instale como app no celular e use offline em qualquer lugar.',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Globe,
    title: 'Totalmente Gratuito',
    description:
      'Sem anúncios, sem cadastro, sem limitações. Música para todos.',
    color: 'from-teal-500 to-cyan-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeatureGrid() {
  return (
    <section id="acordes" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              dominar harmonia
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma plataforma completa construída por músicos, para músicos.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
