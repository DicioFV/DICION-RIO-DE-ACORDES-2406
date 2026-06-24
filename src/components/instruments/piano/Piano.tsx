import type { Chord } from '@/lib/music-theory/types';
import { usePianoState } from '@/hooks/usePianoState';
import { PianoKeyboard } from './PianoKeyboard';
import { PianoControls } from './PianoControls';
import { PianoLegend } from './PianoLegend';
import { trackEvent } from '@/lib/analytics';

interface Props {
  chord: Chord | null;
  showControls?: boolean;
  showLegend?: boolean;
  onKeyPress?: (midi: number) => void;
  className?: string;
}

/**
 * Componente Piano completo: teclado + controles + legenda
 *
 * Pode ser usado em qualquer página passando um Chord.
 */
export function Piano({
  chord,
  showControls = true,
  showLegend = true,
  onKeyPress,
  className,
}: Props) {
  const piano = usePianoState({ chord });

  const handleKeyPress = (midi: number) => {
    onKeyPress?.(midi);
    trackEvent('chord_played', { chordSymbol: chord?.symbol, midi });
  };

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {/* Teclado */}
      <div className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/30 p-4 shadow-sm overflow-hidden">
        <PianoKeyboard
          keysData={piano.keysData}
          startMidi={piano.startMidi}
          endMidi={piano.endMidi}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Legenda */}
      {showLegend && <PianoLegend />}

      {/* Controles */}
      {showControls && piano.maxInversions > 0 && (
        <PianoControls
          voicing={piano.voicing}
          inversion={piano.inversion}
          maxInversions={piano.maxInversions}
          hand={piano.hand}
          displayMode={piano.displayMode}
          range={piano.range}
          octaveOffset={piano.octaveOffset}
          onVoicingChange={(v) => {
            piano.setVoicing(v);
            trackEvent('voicing_changed', { voicing: v });
          }}
          onInversionChange={(i) => {
            piano.setInversion(i);
            trackEvent('inversion_changed', { inversion: i });
          }}
          onHandChange={piano.setHand}
          onDisplayModeChange={piano.setDisplayMode}
          onRangeChange={piano.setRange}
          onOctaveChange={piano.setOctaveOffset}
        />
      )}
    </div>
  );
}
