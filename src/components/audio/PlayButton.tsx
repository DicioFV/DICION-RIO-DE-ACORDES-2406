import { Play, Pause, Loader2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Chord } from '@/lib/music-theory/types';
import { usePlayChord } from '@/hooks/usePlayChord';
import { useAudioInit } from '@/hooks/useAudioInit';
import { useAudioStore } from '@/store/useAudioStore';

interface Props {
  chord: Chord | null;
  voicing?: string;
  inversion?: number;
  baseOctave?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PlayButton({
  chord,
  voicing,
  inversion,
  baseOctave,
  size = 'md',
  className,
}: Props) {
  const ready = useAudioInit();
  const muted = useAudioStore((s) => s.muted);
  const { play, isPlaying, isLoading } = usePlayChord({
    voicing,
    inversion,
    baseOctave,
  });

  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
    xl: 'h-9 w-9',
  };

  const handleClick = () => {
    if (!chord || isPlaying || isLoading) return;
    play(chord);
  };

  const disabled = !chord || isLoading;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.08 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold shadow-lg transition-all cursor-pointer ${
        disabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : muted
          ? 'bg-muted text-muted-foreground'
          : 'bg-gradient-to-br from-primary to-accent text-white hover:shadow-xl hover:shadow-primary/25'
      } ${className ?? ''}`}
      aria-label={isPlaying ? 'Tocando' : 'Tocar acorde'}
      title={!ready ? 'Clique para ativar o áudio' : muted ? 'Áudio mutado' : 'Tocar'}
    >
      {muted ? (
        <VolumeX className={iconSizes[size]} />
      ) : isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : isPlaying ? (
        <Pause className={iconSizes[size]} />
      ) : (
        <Play className={`${iconSizes[size]} ml-0.5`} />
      )}
    </motion.button>
  );
}
