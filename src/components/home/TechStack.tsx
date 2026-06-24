import { motion } from 'framer-motion';

const technologies = [
  { name: 'React', category: 'Framework', icon: '⚛️' },
  { name: 'TypeScript', category: 'Linguagem', icon: '📘' },
  { name: 'Tailwind CSS', category: 'Estilização', icon: '🎨' },
  { name: 'Zustand', category: 'Estado', icon: '🐻' },
  { name: 'Tone.js', category: 'Áudio', icon: '🔊' },
  { name: 'Framer Motion', category: 'Animação', icon: '✨' },
  { name: 'Lucide', category: 'Ícones', icon: '💠' },
  { name: 'Vite', category: 'Build', icon: '⚡' },
];

export function TechStack() {
  return (
    <section id="exercicios" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Construído com{' '}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              tecnologia moderna
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Stack profissional para máxima performance e experiência do usuário.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="p-4 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {tech.icon}
              </div>
              <div className="font-bold text-sm">{tech.name}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {tech.category}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
