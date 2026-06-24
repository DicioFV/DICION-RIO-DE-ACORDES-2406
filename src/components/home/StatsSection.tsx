import { motion } from 'framer-motion';

const stats = [
  { value: '1.000+', label: 'Acordes catalogados', icon: '🎵' },
  { value: '7', label: 'Instrumentos suportados', icon: '🎸' },
  { value: '710+', label: 'Questões de exercício', icon: '🎯' },
  { value: '21', label: 'Blocos implementados', icon: '🏗️' },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
