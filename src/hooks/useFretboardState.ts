import { useState, useMemo, useEffect } from 'react';
import type { Chord } from '@/lib/music-theory/types';
import type {
  FretboardInstrument,
  FretboardConfig,
  FretboardOrientation,
  FretboardView,
  FretboardDisplay,
  Tuning,
} from '@/lib/fretboard/fretboard-types';
import { findChordShapes } from '@/lib/fretboard/chord-shape-finder';
import { getTuningsForInstrument } from '@/lib/fretboard/tunings';

interface Options {
  chord: Chord | null;
  initialInstrument?: FretboardInstrument;
  initialTuningId?: string;
  initialOrientation?: FretboardOrientation;
  initialView?: FretboardView;
  initialDisplay?: FretboardDisplay;
}

export function useFretboardState(options: Options) {
  const {
    chord,
    initialInstrument = 'guitar-nylon',
    initialTuningId = 'standard',
    initialOrientation = 'right-handed',
    initialView = 'diagram',
    initialDisplay = 'fingering',
  } = options;

  const [instrument, setInstrument] =
    useState<FretboardInstrument>(initialInstrument);
  const [tuningId, setTuningId] = useState(initialTuningId);
  const [orientation, setOrientation] =
    useState<FretboardOrientation>(initialOrientation);
  const [view, setView] = useState<FretboardView>(initialView);
  const [display, setDisplay] = useState<FretboardDisplay>(initialDisplay);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  // Tuning atual
  const availableTunings = useMemo(
    () => getTuningsForInstrument(instrument),
    [instrument]
  );
  const tuning: Tuning = useMemo(
    () => availableTunings.find((t) => t.id === tuningId) || availableTunings[0],
    [availableTunings, tuningId]
  );

  // Reset tuning ao trocar instrumento
  useEffect(() => {
    setTuningId(availableTunings[0]?.id ?? 'standard');
  }, [instrument, availableTunings]);

  // Calcula shapes do acorde
  const shapes = useMemo(
    () => (chord ? findChordShapes(chord, tuning, 5, instrument) : []),
    [chord, tuning, instrument]
  );

  // Reset shape index ao trocar acorde/tuning
  useEffect(() => {
    setCurrentShapeIndex(0);
  }, [chord?.symbol, tuningId]);

  const config: FretboardConfig = {
    instrument,
    tuning,
    orientation,
    view,
    display,
    showAllNotes,
    fretCount: 22,
  };

  return {
    config,
    shapes,
    currentShape: shapes[currentShapeIndex] ?? null,
    currentShapeIndex,
    setCurrentShapeIndex,
    availableTunings,
    setInstrument,
    setTuningId,
    setOrientation,
    setView,
    setDisplay,
    setShowAllNotes,
  };
}
