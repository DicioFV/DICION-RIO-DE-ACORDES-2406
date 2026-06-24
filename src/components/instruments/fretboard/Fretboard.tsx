import type { Chord } from '@/lib/music-theory/types';
import type { FretboardInstrument } from '@/lib/fretboard/fretboard-types';
import { useFretboardState } from '@/hooks/useFretboardState';
import { FretboardDiagram } from './FretboardDiagram';
import { FretboardFull } from './FretboardFull';
import { FretboardMandolin } from './FretboardMandolin';
import { FretboardControls } from './FretboardControls';
import { getInstrumentSpec } from '@/lib/fretboard/instrument-specs';
import { trackEvent } from '@/lib/analytics';

interface Props {
  chord: Chord | null;
  defaultInstrument?: FretboardInstrument;
  showControls?: boolean;
  className?: string;
}

/**
 * Componente Fretboard completo — auto-seleciona renderer por instrumento
 */
export function Fretboard({
  chord,
  defaultInstrument = 'guitar-nylon',
  showControls = true,
  className,
}: Props) {
  const fb = useFretboardState({
    chord,
    initialInstrument: defaultInstrument,
  });

  const spec = getInstrumentSpec(fb.config.instrument);

  if (!chord) {
    return (
      <div className="p-8 text-center text-muted-foreground rounded-xl border border-border bg-card">
        Selecione um acorde para visualizar
      </div>
    );
  }

  if (fb.shapes.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-border bg-card">
        <div className="text-4xl mb-2">{spec.emoji}</div>
        <p className="font-semibold">Nenhum shape encontrado no {spec.shortName}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Tente outra afinação ou instrumento.
        </p>
      </div>
    );
  }

  // Escolhe renderer baseado no instrumento e vista
  const renderInstrument = () => {
    // Bandolim sempre usa renderer especial no diagrama
    if (spec.isPaired && fb.config.view === 'diagram' && fb.currentShape) {
      return <FretboardMandolin shape={fb.currentShape} config={fb.config} />;
    }

    // Demais: diagrama padrão ou braço completo
    if (fb.config.view === 'diagram' && fb.currentShape) {
      return <FretboardDiagram shape={fb.currentShape} config={fb.config} />;
    }

    return <FretboardFull shape={fb.currentShape} config={fb.config} />;
  };

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {/* Badge do instrumento */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-base">{spec.emoji}</span>
          <span className="text-xs font-semibold text-primary">
            {spec.name}
          </span>
        </div>
        {fb.shapes.length > 1 && (
          <div className="text-xs text-muted-foreground">
            {fb.shapes.length} posições disponíveis
          </div>
        )}
      </div>

      {/* Renderização */}
      <div className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/30 p-6 shadow-sm flex justify-center">
        {renderInstrument()}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Tônica</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span>Notas do acorde</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold">✕</span>
          <span>Corda mutada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-current" />
          <span>Corda solta</span>
        </div>
        {spec.isPaired && (
          <div className="flex items-center gap-1.5">
            <span className="text-primary font-bold">‖</span>
            <span>Cordas duplas (par)</span>
          </div>
        )}
      </div>

      {showControls && (
        <FretboardControls
          config={fb.config}
          shapes={fb.shapes}
          currentShapeIndex={fb.currentShapeIndex}
          availableTunings={fb.availableTunings}
          onShapeChange={(i) => {
            fb.setCurrentShapeIndex(i);
            trackEvent('chord_viewed', { shape: String(i) });
          }}
          onInstrumentChange={(i) => {
            fb.setInstrument(i);
            trackEvent('instrument_changed', { instrument: i });
          }}
          onTuningChange={fb.setTuningId}
          onViewChange={fb.setView}
          onDisplayChange={fb.setDisplay}
          onOrientationChange={fb.setOrientation}
        />
      )}
    </div>
  );
}
