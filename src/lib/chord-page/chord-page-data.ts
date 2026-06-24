import type { ChordEntry } from '@/data/chords/chord-schema';
import { getChordBySlug, getChordById } from '@/data/chords/chord-database';
import { tryParseChord } from '@/lib/music-theory';
import type { Chord } from '@/lib/music-theory/types';
import { findRelatedChords } from './related-chords';
import { findSubstitutes, type Substitute } from './substitutes';

export interface ChordPageData {
  entry: ChordEntry;
  chord: Chord;
  related: ChordEntry[];
  substitutes: Substitute[];
  enharmonics: ChordEntry[];
}

export function getChordPageData(slug: string): ChordPageData | null {
  const entry = getChordBySlug(slug);
  if (!entry) return null;

  const chord = tryParseChord(entry.symbol);
  if (!chord) return null;

  const related = findRelatedChords(entry, 8);
  const substitutes = findSubstitutes(entry);
  const enharmonics = entry.enharmonicEquivalents
    .map((id) => getChordById(id))
    .filter((c): c is ChordEntry => c !== null);

  return { entry, chord, related, substitutes, enharmonics };
}
