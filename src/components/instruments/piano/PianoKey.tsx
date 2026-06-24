import { motion } from 'framer-motion';
import type { PianoKeyData } from '@/lib/piano/piano-types';
import { PIANO_DIMENSIONS, getKeyX } from '@/lib/piano/piano-layout';

interface Props {
  keyData: PianoKeyData;
  startMidi: number;
  onPress?: (midi: number) => void;
}

export function PianoKey({ keyData, startMidi, onPress }: Props) {
  const { midi, isBlack, isActive, isRoot, isBass, label, hand } = keyData;

  const { whiteKeyWidth, whiteKeyHeight, blackKeyWidth, blackKeyHeight } =
    PIANO_DIMENSIONS;

  const x = getKeyX(midi, startMidi);
  const width = isBlack ? blackKeyWidth : whiteKeyWidth;
  const height = isBlack ? blackKeyHeight : whiteKeyHeight;

  // Cores
  let fill = isBlack ? '#1a1a2e' : '#f8fafc';
  let labelColor = isBlack ? '#fff' : '#1a1a2e';

  if (isActive) {
    if (isBass && !isRoot) {
      fill = '#0ea5e9'; // azul para baixo invertido
      labelColor = '#fff';
    } else if (isRoot) {
      fill = '#f59e0b'; // dourado para tônica
      labelColor = '#000';
    } else {
      fill = '#8b5cf6'; // roxo para demais notas
      labelColor = '#fff';
    }
  }

  return (
    <g
      onClick={() => onPress?.(midi)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`Tecla ${keyData.pitch.note.name}${keyData.pitch.octave}`}
    >
      {/* Sombra (apenas teclas ativas) */}
      {isActive && (
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          x={x - 2}
          y={isBlack ? 0 : -2}
          width={width + 4}
          height={height + 4}
          rx={isBlack ? 2 : 4}
          fill={fill}
          style={{ filter: 'blur(4px)' }}
        />
      )}

      {/* Tecla */}
      <motion.rect
        initial={false}
        animate={{
          fill,
          y: isActive ? 2 : 0,
        }}
        transition={{ duration: 0.1 }}
        x={x}
        y={0}
        width={width}
        height={height}
        rx={isBlack ? 2 : 4}
        stroke="#334155"
        strokeWidth={0.5}
      />

      {/* Indicador de oitava (apenas Cs brancos) */}
      {!isBlack && keyData.pitch.note.name === 'C' && (
        <text
          x={x + width / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize={8}
          fill="#94a3b8"
          style={{ pointerEvents: 'none' }}
        >
          C{keyData.pitch.octave}
        </text>
      )}

      {/* Indicador de mão (D/E) */}
      {isActive && hand && (
        <>
          <circle
            cx={x + width / 2}
            cy={isBlack ? 14 : 18}
            r={isBlack ? 6 : 8}
            fill={hand === 'right' ? '#0ea5e9' : '#f59e0b'}
            stroke="white"
            strokeWidth={1}
          />
          <text
            x={x + width / 2}
            y={isBlack ? 17 : 22}
            textAnchor="middle"
            fontSize={isBlack ? 7 : 9}
            fontWeight="bold"
            fill="white"
            style={{ pointerEvents: 'none' }}
          >
            {hand === 'right' ? 'D' : 'E'}
          </text>
        </>
      )}

      {/* Label (nome, grau, dedilhado) */}
      {label && (
        <motion.text
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          x={x + width / 2}
          y={isBlack ? height - 14 : height - 28}
          textAnchor="middle"
          fontSize={isBlack ? 8 : 11}
          fontWeight={isActive ? 700 : 400}
          fill={labelColor}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </motion.text>
      )}

      {/* Marcador de raiz (estrela) */}
      {isRoot && (
        <motion.text
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          x={x + width / 2}
          y={isBlack ? 32 : 42}
          textAnchor="middle"
          fontSize={12}
          style={{ pointerEvents: 'none' }}
        >
          ★
        </motion.text>
      )}
    </g>
  );
}
