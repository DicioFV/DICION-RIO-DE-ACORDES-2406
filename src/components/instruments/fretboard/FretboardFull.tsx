import { motion } from 'framer-motion';
import type { ChordShape, FretboardConfig } from '@/lib/fretboard/fretboard-types';
import {
  FRETBOARD_DIMENSIONS,
  FRET_MARKERS,
  DOUBLE_FRET_MARKERS,
} from '@/lib/fretboard/fretboard-layout';

interface Props {
  shape: ChordShape | null;
  config: FretboardConfig;
  className?: string;
}

export function FretboardFull({ shape, config, className }: Props) {
  const dim = FRETBOARD_DIMENSIONS.full;
  const stringCount = config.tuning.notes.length;
  const fretCount = Math.min(config.fretCount, 15);
  const isLeftHanded = config.orientation === 'left-handed';

  // Calculate fret positions with proportional widths
  let acc = dim.paddingX;
  const fretXs: number[] = [acc];
  for (let f = 0; f < fretCount; f++) {
    const w = dim.fretWidth * Math.pow(0.96, f);
    acc += w;
    fretXs.push(acc);
  }

  const totalWidth = acc + dim.paddingX;
  const totalHeight = dim.paddingY * 2 + dim.stringSpacing * (stringCount - 1);

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{
          minWidth: 600,
          maxHeight: 200,
          transform: isLeftHanded ? 'scaleX(-1)' : undefined,
        }}
      >
        {/* Fundo do braço */}
        <rect
          x={dim.paddingX}
          y={dim.paddingY - 8}
          width={totalWidth - dim.paddingX * 2}
          height={dim.stringSpacing * (stringCount - 1) + 16}
          fill="#3d2b1f"
          rx={2}
        />

        {/* Marcadores */}
        {FRET_MARKERS.map((fret) => {
          if (fret > fretCount) return null;
          const x = (fretXs[fret - 1] + fretXs[fret]) / 2;
          const y =
            dim.paddingY + (dim.stringSpacing * (stringCount - 1)) / 2;
          return (
            <circle
              key={`marker-${fret}`}
              cx={x}
              cy={y}
              r={dim.fretMarkerRadius}
              fill="#8b7355"
              opacity={0.5}
            />
          );
        })}
        {DOUBLE_FRET_MARKERS.map((fret) => {
          if (fret > fretCount) return null;
          const x = (fretXs[fret - 1] + fretXs[fret]) / 2;
          const yTop = dim.paddingY + dim.stringSpacing * 1.2;
          const yBot =
            dim.paddingY + dim.stringSpacing * (stringCount - 2.2);
          return (
            <g key={`marker2-${fret}`}>
              <circle cx={x} cy={yTop} r={dim.fretMarkerRadius} fill="#8b7355" opacity={0.5} />
              <circle cx={x} cy={yBot} r={dim.fretMarkerRadius} fill="#8b7355" opacity={0.5} />
            </g>
          );
        })}

        {/* Trastes verticais */}
        {fretXs.map((x, i) => (
          <line
            key={`fret-${i}`}
            x1={x}
            y1={dim.paddingY - 8}
            x2={x}
            y2={dim.paddingY + dim.stringSpacing * (stringCount - 1) + 8}
            stroke={i === 0 ? 'currentColor' : '#a0845c'}
            strokeWidth={i === 0 ? 5 : 1.5}
          />
        ))}

        {/* Cordas horizontais */}
        {Array.from({ length: stringCount }).map((_, i) => {
          const visualString = stringCount - 1 - i;
          const y = dim.paddingY + visualString * dim.stringSpacing;
          const thickness = 0.8 + (i / stringCount) * 1.4;
          return (
            <line
              key={`string-${i}`}
              x1={dim.paddingX}
              y1={y}
              x2={totalWidth - dim.paddingX}
              y2={y}
              stroke="#d4c5b0"
              strokeWidth={thickness}
              opacity={0.9}
            />
          );
        })}

        {/* Fret numbers */}
        {Array.from({ length: fretCount }).map((_, i) => {
          const fret = i + 1;
          const x = (fretXs[i] + fretXs[i + 1]) / 2;
          return (
            <text
              key={`num-${fret}`}
              x={x}
              y={12}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.4}
              style={{
                transform: isLeftHanded ? `scaleX(-1)` : undefined,
                transformOrigin: `${x}px 12px`,
              }}
            >
              {fret}
            </text>
          );
        })}

        {/* Chord positions */}
        {shape &&
          shape.positions.map((p) => {
            if (p.fret < 0) return null;

            const visualString = stringCount - 1 - p.string;
            const y = dim.paddingY + visualString * dim.stringSpacing;

            const x =
              p.fret === 0
                ? dim.paddingX - 14
                : (fretXs[p.fret - 1] + fretXs[p.fret]) / 2;

            if (p.fret > fretCount) return null;

            const fillColor = p.isRoot ? '#f59e0b' : '#8b5cf6';
            const textColor = p.isRoot ? '#000' : '#fff';

            let label = '';
            if (config.display === 'fingering' && p.finger)
              label = String(p.finger);
            else if (config.display === 'note-names' && p.note)
              label = p.note.name;
            else if (config.display === 'degrees' && p.degree)
              label = p.degree;

            return (
              <motion.g
                key={`pos-${p.string}-${p.fret}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.04 * p.string }}
              >
                <circle cx={x} cy={y} r={dim.dotRadius} fill={fillColor} />
                {p.isRoot && (
                  <circle
                    cx={x}
                    cy={y}
                    r={dim.dotRadius + 3}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                  />
                )}
                {label && (
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill={textColor}
                    style={{
                      pointerEvents: 'none',
                      transform: isLeftHanded ? `scaleX(-1)` : undefined,
                      transformOrigin: `${x}px ${y + 4}px`,
                    }}
                  >
                    {label}
                  </text>
                )}
              </motion.g>
            );
          })}

        {/* Tuning labels */}
        {config.tuning.notes.map((note, i) => {
          const visualString = stringCount - 1 - i;
          const y = dim.paddingY + visualString * dim.stringSpacing;
          return (
            <text
              key={`tn-${i}`}
              x={dim.paddingX - 24}
              y={y + 4}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="currentColor"
              opacity={0.4}
              style={{
                transform: isLeftHanded ? `scaleX(-1)` : undefined,
                transformOrigin: `${dim.paddingX - 24}px ${y + 4}px`,
              }}
            >
              {note}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
