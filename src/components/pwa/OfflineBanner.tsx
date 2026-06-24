import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner({ isOffline, voltouOnline }: { isOffline: boolean; voltouOnline: boolean }) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div key="offline" initial={{ y: -48 }} animate={{ y: 0 }} exit={{ y: -48 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-center gap-2 py-2.5 px-4">
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-sm text-white font-medium">Você está offline — conteúdo em cache</p>
          </div>
        </motion.div>
      )}
      {voltouOnline && !isOffline && (
        <motion.div key="online" initial={{ y: -48 }} animate={{ y: 0 }} exit={{ y: -48 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600">
          <div className="flex items-center justify-center gap-2 py-2.5 px-4">
            <Wifi className="h-3.5 w-3.5 text-white" />
            <p className="text-sm text-white font-medium">Conexão restaurada! ✓</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
