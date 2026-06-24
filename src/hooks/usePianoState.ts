import { useMemo, useState, useEffect } from 'react';
import type { Chord } from '@/lib/music-theory/types';
import type {
  PianoState,
  PianoConfig,
  PianoHand,
  PianoDisplayMode,
  PianoRange,
} from '@/lib/piano/piano-types';
import { computeActiveMidis, generateKeysData } from '@/lib/piano/piano-engine';
import { PIANO_RANGES, getChordFocusRange } from '@/lib/piano/piano-layout';

interface UsePianoStateOptions {
  chord: Chord | null;
  initialVoicing?: string;
  initialInversion?: number;
  initialRange?: PianoRange;
  initialHand?: PianoHand;
  initialDisplayMode?: PianoDisplayMode;
  baseOctave?: number;
}

export function usePianoState(options: UsePianoStateOptions) {
  const {
    chord,
    initialVoicing = 'close',
    initialInversion = 0,
    initialRange = 'chord-focus',
    initialHand = 'right',
    initialDisplayMode = 'note-names',
    baseOctave = 4,
  } = options;

  const [voicing, setVoicing] = useState(initialVoicing);
  const [inversion, setInversion] = useState(initialInversion);
  const [range, setRange] = useState<PianoRange>(initialRange);
  const [hand, setHand] = useState<PianoHand>(initialHand);
  const [displayMode, setDisplayMode] =
    useState<PianoDisplayMode>(initialDisplayMode);
  const [octaveOffset, setOctaveOffset] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset inversion ao trocar de acorde
  useEffect(() => {
    setInversion(0);
  }, [chord?.symbol]);

  // Calcula MIDIs ativos
  const activeKeys = useMemo(
    () => computeActiveMidis(chord, voicing, inversion, baseOctave + octaveOffset),
    [chord, voicing, inversion, baseOctave, octaveOffset]
  );

  // Calcula range dinâmico
  const { startMidi, endMidi } = useMemo(() => {
    if (range === 'chord-focus') {
      const r = getChordFocusRange(activeKeys);
      return { startMidi: r.start, endMidi: r.end };
    }
    const r = PIANO_RANGES[range];
    return { startMidi: r.start, endMidi: r.end };
  }, [range, activeKeys]);

  // Gera estado completo
  const config: PianoConfig = {
    range,
    startMidi,
    endMidi,
    hand,
    displayMode,
    showOctaveNumbers: range === 'full-88',
    zoomLevel,
  };

  const state: PianoState = {
    chord,
    inversion,
    voicing,
    config,
    activeKeys,
  };

  const keysData = useMemo(
    () => generateKeysData(state, startMidi, endMidi),
    [state, startMidi, endMidi]
  );

  // Número de inversões disponíveis
  const maxInversions = chord?.notes.length ?? 0;

  return {
    state,
    keysData,
    // setters
    setVoicing,
    setInversion,
    setRange,
    setHand,
    setDisplayMode,
    setOctaveOffset,
    setZoomLevel,
    // values
    voicing,
    inversion,
    range,
    hand,
    displayMode,
    octaveOffset,
    zoomLevel,
    maxInversions,
    activeKeys,
    startMidi,
    endMidi,
  };
}
