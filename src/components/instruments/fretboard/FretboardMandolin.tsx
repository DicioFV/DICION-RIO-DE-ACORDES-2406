import { motion } from 'framer-motion';
import type { ChordShape, FretboardConfig } from '@/lib/fretboard/fretboard-types';
import {
  calculateMandolinStringPositions,
  getMandolinTotalStringWidth,
} from '@/lib/fretboard/mandolin-renderer';

interface Props {
  shape: ChordShape;
  config: FretboardConfig;
  className?: string;
}

const FRETS_VISIBLE = 4;
const FRET_SPACING = 36;
const PADDING_X = 30;
const PADDING_TOP = 45;
const DOT_RADIUS = 9;

export function FretboardMandolin({ shape, config, className }: Props) {
  const isLeftHanded = config.orientation === 'left-handed';
  const baseFret = Math.max(shape.baseFret, 1);
  const showNut = baseFret <= 1;

  const stringLayout = calculateMandolinStringPositions(PADDING_X);
  const totalStringWidth = getMandolinTotalStringWidth();
  const totalWidth = PADDING_X * 2 + totalStringWidth;
  const totalHeight = PADDING_TOP + FRET_SPACING * FRETS_VISIBLE + 40;

  // For mandolin, positions use real string indices (0-7)
  // We need to map them to visual positions

  return (
    <div className={`inline-block ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto"
        style={{
          maxWidth: 260,
          transform: isLeftHanded ? 'scaleX(-1)' : undefined,
        }}
      >
        {/* Nome do acorde */}
        <text
          x={totalWidth / 2}
          y={20}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          fill="currentColor"
          style={{
            transform: isLeftHanded ? 'scaleX(-1)' : undefined,
            transformOrigin: `${totalWidth / 2}px 20px`,
          }}
        >
          {shape.chord.symbol}
        </text>

        {/* Casa inicial */}
        {!showNut && (
          <text
            x={PADDING_X - 14}
            y={PADDING_TOP + FRET_SPACING / 2 + 4}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            opacity={0.5}
            fontWeight={600}
            style={{
              transform: isLeftHanded ? 'scaleX(-1)' : undefined,
              transformOrigin: `${PADDING_X - 14}px ${PADDING_TOP + FRET_SPACING / 2 + 4}px`,
            }}
          >
            {baseFret}
          </text>
        )}

        {/* Nut */}
        {showNut && (
          <rect
            x={PADDING_X - 4}
            y={PADDING_TOP - 6}
            width={totalStringWidth + 8}
            height={5}
            fill="currentColor"
            rx={1}
          />
        )}

        {/* Trastes horizontais */}
        {Array.from({ length: FRETS_VISIBLE + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={PADDING_X - 4}
            y1={PADDING_TOP + i * FRET_SPACING}
            x2={PADDING_X + totalStringWidth + 4}
            y2={PADDING_TOP + i * FRET_SPACING}
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeWidth={1.5}
          />
        ))}

        {/* Cordas (8) */}
        {stringLayout.map((s) => (
          <line
            key={`string-${s.realStringIdx}`}
            x1={s.x}
            y1={PADDING_TOP}
            x2={s.x}
            y2={PADDING_TOP + FRETS_VISIBLE * FRET_SPACING}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        ))}

        {/* Indicadores de par (line connecting each pair at top) */}
        {[0, 1, 2, 3].map((pairIdx) => {
          const pairStrings = stringLayout.filter(
            (s) => s.pairIdx === pairIdx
          );
          if (pairStrings.length < 2) return null;
          const x1 = pairStrings[0].x;
          const x2 = pairStrings[1].x;
          return (
            <line
              key={`pair-${pairIdx}`}
              x1={x1}
              x2={x2}
              y1={PADDING_TOP - 14}
              y2={PADDING_TOP - 14}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Open/Muted indicators - show once per pair */}
        {shape.positions
          .filter((p) => p.string % 2 === 0) // Only first of each pair
          .map((p) => {
            const pairIdx = Math.floor(p.string / 2);
            // Visual: pair 0 = leftmost (reversed from usual)
            const visualPair = 3 - pairIdx;
            const pairStrings = stringLayout.filter(
              (s) => s.pairIdx === visualPair
            );
            if (pairStrings.length < 2) return null;
            const centerX =
              (pairStrings[0].x + pairStrings[1].x) / 2;

            if (p.fret === -1) {
              return (
                <text
                  key={`mute-${pairIdx}`}
                  x={centerX}
                  y={PADDING_TOP - 22}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill="currentColor"
                  opacity={0.4}
                  style={{
                    transform: isLeftHanded ? 'scaleX(-1)' : undefined,
                    transformOrigin: `${centerX}px ${PADDING_TOP - 22}px`,
                  }}
                >
                  ✕
                </text>
              );
            }

            if (p.fret === 0) {
              return (
                <circle
                  key={`open-${pairIdx}`}
                  cx={centerX}
                  cy={PADDING_TOP - 22}
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

        {/* Dots - show once per pair centered between pair strings */}
        {shape.positions
          .filter((p) => p.string % 2 === 0 && p.fret > 0) // First of each pair, fretted
          .map((p) => {
            const pairIdx = Math.floor(p.string / 2);
            const fretOffset = p.fret - baseFret + 1;
            if (fretOffset < 1 || fretOffset > FRETS_VISIBLE) return null;

            // Visual: pair 0 = leftmost
            const visualPair = 3 - pairIdx;
            const pairStrings = stringLayout.filter(
              (s) => s.pairIdx === visualPair
            );
            if (pairStrings.length < 2) return null;

            const centerX =
              (pairStrings[0].x + pairStrings[1].x) / 2;
            const y =
              PADDING_TOP + (fretOffset - 0.5) * FRET_SPACING;

            const fillColor = p.isRoot ? '#f59e0b' : '#8b5cf6';
            const textColor = p.isRoot ? '#000' : '#fff';

            let label = '';
            if (config.display === 'fingering' && p.finger)
              label = String(p.finger);
            else if (config.display === 'note-names' && p.note)
              label = p.note.name;
            else if (config.display === 'degrees' && p.degree)
              label = p.degree;

            // Draw wider dot spanning both strings
            const dotWidth = (pairStrings[1].x - pairStrings[0].x) + DOT_RADIUS * 2;

            return (
              <motion.g
                key={`dot-${pairIdx}-${p.fret}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.06 * pairIdx }}
              >
                <rect
                  x={centerX - dotWidth / 2}
                  y={y - DOT_RADIUS}
                  width={dotWidth}
                  height={DOT_RADIUS * 2}
                  rx={DOT_RADIUS}
                  fill={fillColor}
                />
                {p.isRoot && (
                  <rect
                    x={centerX - dotWidth / 2 - 2}
                    y={y - DOT_RADIUS - 2}
                    width={dotWidth + 4}
                    height={DOT_RADIUS * 2 + 4}
                    rx={DOT_RADIUS + 2}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                  />
                )}
                {label && (
                  <text
                    x={centerX}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill={textColor}
                    style={{
                      pointerEvents: 'none',
                      transform: isLeftHanded ? 'scaleX(-1)' : undefined,
                      transformOrigin: `${centerX}px ${y + 4}px`,
                    }}
                  >
                    {label}
                  </text>
                )}
              </motion.g>
            );
          })}

        {/* Tuning labels (one per pair) */}
        {config.tuning.notes.map((note, i) => {
          const visualPair = config.tuning.notes.length - 1 - i;
          const pairStrings = stringLayout.filter(
            (s) => s.pairIdx === visualPair
          );
          if (pairStrings.length < 2) return null;
          const centerX =
            (pairStrings[0].x + pairStrings[1].x) / 2;

          return (
            <text
              key={`tn-${i}`}
              x={centerX}
              y={PADDING_TOP + FRETS_VISIBLE * FRET_SPACING + 20}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="currentColor"
              opacity={0.4}
              style={{
                transform: isLeftHanded ? 'scaleX(-1)' : undefined,
                transformOrigin: `${centerX}px ${PADDING_TOP + FRETS_VISIBLE * FRET_SPACING + 20}px`,
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
