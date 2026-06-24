import { PianoKey } from './PianoKey';
import type { PianoKeyData } from '@/lib/piano/piano-types';
import { PIANO_DIMENSIONS, getTotalWidth } from '@/lib/piano/piano-layout';

interface Props {
  keysData: PianoKeyData[];
  startMidi: number;
  endMidi: number;
  onKeyPress?: (midi: number) => void;
  className?: string;
}

export function PianoKeyboard({
  keysData,
  startMidi,
  endMidi,
  onKeyPress,
  className,
}: Props) {
  const totalWidth = getTotalWidth(startMidi, endMidi);
  const height = PIANO_DIMENSIONS.whiteKeyHeight + 8;

  // Separa brancas e pretas (pretas devem ser renderizadas DEPOIS para ficarem por cima)
  const whites = keysData.filter((k) => !k.isBlack);
  const blacks = keysData.filter((k) => k.isBlack);

  return (
    <div className={`relative w-full overflow-x-auto ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto select-none"
        style={{ minHeight: 160, maxHeight: 260 }}
      >
        {/* Fundo */}
        <rect
          width={totalWidth}
          height={height}
          fill="transparent"
          rx={8}
        />

        {/* Renderiza brancas primeiro */}
        {whites.map((k) => (
          <PianoKey
            key={`w-${k.midi}`}
            keyData={k}
            startMidi={startMidi}
            onPress={onKeyPress}
          />
        ))}

        {/* Depois pretas (ficam por cima) */}
        {blacks.map((k) => (
          <PianoKey
            key={`b-${k.midi}`}
            keyData={k}
            startMidi={startMidi}
            onPress={onKeyPress}
          />
        ))}
      </svg>
    </div>
  );
}
