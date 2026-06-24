import { useState } from 'react';
import type { FretboardInstrument } from '@/lib/fretboard/fretboard-types';

export type ChordPageInstrument = 'piano' | FretboardInstrument;

export function useChordPageState(defaultInstrument: ChordPageInstrument = 'piano') {
  const [activeInstrument, setInstrument] = useState<ChordPageInstrument>(defaultInstrument);
  const [pedagogicalLevel, setPedagogicalLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  return { activeInstrument, setInstrument, pedagogicalLevel, setPedagogicalLevel };
}
