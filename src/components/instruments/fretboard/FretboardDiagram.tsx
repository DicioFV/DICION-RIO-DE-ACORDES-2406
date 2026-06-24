import { motion } from 'framer-motion';
import type { ChordShape, FretboardConfig } from '@/lib/fretboard/fretboard-types';
import { FRETBOARD_DIMENSIONS } from '@/lib/fretboard/fretboard-layout';

interface Props {
  shape: ChordShape;
  config: FretboardConfig;
  className?: string;
}

const FRETS_VISIBLE = 5;

export function FretboardDiagram({ shape, config, className }: Props) {
  const dim = FRETBOARD_DIMENSIONS.diagram;
  const stringCount = config.tuning.notes.length;
  const isLeftHanded = config.orientation === 'left-handed';

  const fretboardWidth = dim.stringSpacing * (stringCount - 1);
  const fretboardHeight = dim.fretSpacing * FRETS_VISIBLE;
  const totalWidth = dim.paddingX * 2 + fretboardWidth;
  const totalHeight = dim.paddingTop + fretboardHeight + dim.paddingBottom;

  const baseFret = Math.max(shape.baseFret, 1);
  const showNut = baseFret <= 1;

  return (
    <div className={`inline-block ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto"
        style={{
          maxWidth: 200,
          transform: isLeftHanded ? 'scaleX(-1)' : undefined,
        }}
      >
        {/* Nome do acorde */}
        <text
          x={totalWidth / 2}
          y={18}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          fill="currentColor"
          style={{
            transform: isLeftHanded ? `scaleX(-1)` : undefined,
            transformOrigin: `${totalWidth / 2}px 18px`,
          }}
        >
          {shape.chord.symbol}
        </text>

        {/* Casa inicial */}
        {!showNut && (
          <text
            x={dim.paddingX - 16}
            y={dim.paddingTop + dim.fretSpacing / 2 + 4}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            opacity={0.5}
            fontWeight={600}
            style={{
              transform: isLeftHanded ? `scaleX(-1)` : undefined,
              transformOrigin: `${dim.paddingX - 16}px ${dim.paddingTop + dim.fretSpacing / 2 + 4}px`,
            }}
          >
            {baseFret}
          </text>
        )}

        {/* Nut */}
        {showNut && (
          <rect
            x={dim.paddingX - 2}
            y={dim.paddingTop - dim.nutHeight}
            width={fretboardWidth + 4}
            height={dim.nutHeight}
            fill="currentColor"
            rx={1}
          />
        )}

        {/* Trastes horizontais */}
        {Array.from({ length: FRETS_VISIBLE + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={dim.paddingX}
            y1={dim.paddingTop + i * dim.fretSpacing}
            x2={dim.paddingX + fretboardWidth}
            y2={dim.paddingTop + i * dim.fretSpacing}
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeWidth={1.5}
          />
        ))}

        {/* Cordas verticais */}
        {Array.from({ length: stringCount }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={dim.paddingX + i * dim.stringSpacing}
            y1={dim.paddingTop}
            x2={dim.paddingX + i * dim.stringSpacing}
            y2={dim.paddingTop + fretboardHeight}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        ))}

        {/* Indicadores O (solta) e X (mutada) */}
        {shape.positions.map((p) => {
          const visualString = stringCount - 1 - p.string;
          const x = dim.paddingX + visualString * dim.stringSpacing;

          if (p.fret === -1) {
            return (
              <text
                key={`mute-${p.string}`}
                x={x}
                y={dim.paddingTop - 12}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill="currentColor"
                opacity={0.4}
                style={{
                  transform: isLeftHanded ? `scaleX(-1)` : undefined,
                  transformOrigin: `${x}px ${dim.paddingTop - 12}px`,
                }}
              >
                ✕
              </text>
            );
          }

          if (p.fret === 0) {
            return (
              <circle
                key={`open-${p.string}`}
                cx={x}
                cy={dim.paddingTop - 12}
                r={5}
                fill="none"
                stroke={p.isRoot ? '#f59e0b' : 'currentColor'}
                strokeWidth={2}
                opacity={p.isRoot ? 1 : 0.5}
              />
            );
          }

          return null;
        })}

        {/* Pestanas */}
        {shape.barres.map((barre, i) => {
          const fretOffset = barre.fret - baseFret + 1;
          if (fretOffset < 1 || fretOffset > FRETS_VISIBLE) return null;

          const y = dim.paddingTop + (fretOffset - 0.5) * dim.fretSpacing;
          const xFrom =
            dim.paddingX +
            (stringCount - 1 - barre.toString) * dim.stringSpacing;
          const xTo =
            dim.paddingX +
            (stringCount - 1 - barre.fromString) * dim.stringSpacing;

          return (
            <motion.rect
              key={`barre-${i}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.85, scaleX: 1 }}
              x={xFrom - 8}
              y={y - 7}
              width={xTo - xFrom + 16}
              height={14}
              rx={7}
              fill="#8b5cf6"
            />
          );
        })}

        {/* Pontos de digitação */}
        {shape.positions.map((p) => {
          if (p.fret <= 0) return null;

          const fretOffset = p.fret - baseFret + 1;
          if (fretOffset < 1 || fretOffset > FRETS_VISIBLE) return null;

          const visualString = stringCount - 1 - p.string;
          const x = dim.paddingX + visualString * dim.stringSpacing;
          const y = dim.paddingTop + (fretOffset - 0.5) * dim.fretSpacing;

          const fillColor = p.isRoot ? '#f59e0b' : '#8b5cf6';
          const textColor = p.isRoot ? '#000' : '#fff';

          let label = '';
          if (config.display === 'fingering' && p.finger)
            label = String(p.finger);
          else if (config.display === 'note-names' && p.note)
            label = p.note.name;
          else if (config.display === 'degrees' && p.degree) label = p.degree;

          return (
            <motion.g
              key={`dot-${p.string}-${p.fret}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * p.string }}
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

        {/* Nomes das cordas */}
        {config.tuning.notes.map((note, i) => {
          const visualString = stringCount - 1 - i;
          const x = dim.paddingX + visualString * dim.stringSpacing;
          return (
            <text
              key={`tuning-${i}`}
              x={x}
              y={dim.paddingTop + fretboardHeight + 18}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.4}
              style={{
                transform: isLeftHanded ? `scaleX(-1)` : undefined,
                transformOrigin: `${x}px ${dim.paddingTop + fretboardHeight + 18}px`,
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
