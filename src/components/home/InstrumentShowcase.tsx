import { motion } from 'framer-motion';
import { INSTRUMENTS } from '@/config/instruments';
import { useAppStore } from '@/store/useAppStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function InstrumentShowcase() {
  const { currentInstrument, setInstrument } = useAppStore();

  return (
    <section id="instrumentos" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            6 instrumentos.{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Motor próprio para cada um.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada instrumento tem seu próprio sistema de visualização, voicings e inversões
            otimizados para a sua prática musical.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {INSTRUMENTS.map((inst) => {
            const isActive = currentInstrument === inst.id;
            return (
              <motion.button
                key={inst.id}
                variants={itemVariants}
                onClick={() => {
                  setInstrument(inst.id);
                  window.location.hash = inst.id === 'piano' ? '/piano' : '/guitarra';
                }}
                className={`
                  relative p-6 rounded-2xl border text-center transition-all duration-300 group cursor-pointer
                  ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-card/80'
                  }
                `}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent" />
                )}
                <div className="relative">
                  <div
                    className={`text-5xl mb-4 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  >
                    {inst.icon}
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">{inst.name}</h3>
                  {inst.strings && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {inst.strings} cordas
                    </p>
                  )}
                  {isActive && (
                    <div className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
