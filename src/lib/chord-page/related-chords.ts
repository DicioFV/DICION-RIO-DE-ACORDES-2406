import type { ChordEntry } from '@/data/chords/chord-schema';
import { getAllChords, getChordsByRoot } from '@/data/chords/chord-database';

export function findRelatedChords(chord: ChordEntry, max = 8): ChordEntry[] {
  const related: Map<string, { entry: ChordEntry; score: number }> = new Map();
  const commonQualities = ['maj', 'min', '7', 'maj7', 'm7', '6', 'm6', '9', 'sus4'];

  const sameRoot = getChordsByRoot(chord.root.name);
  for (const c of sameRoot) {
    if (c.id === chord.id || c.isSlashChord || c.isPolychord) continue;
    if (commonQualities.includes(c.qualityId)) {
      related.set(c.id, { entry: c, score: 0.8 });
    }
  }

  const chordPitches = new Set(chord.notes.map((n) => n.pitchClass));
  const all = getAllChords();
  for (const c of all) {
    if (c.id === chord.id || related.has(c.id) || c.isSlashChord || c.isPolychord) continue;
    if (c.notes.length < 3) continue;
    const shared = c.notes.filter((n) => chordPitches.has(n.pitchClass)).length;
    if (shared >= 3 && shared >= c.notes.length - 1) {
      related.set(c.id, { entry: c, score: 0.6 + shared * 0.05 });
    }
    if (related.size > max * 3) break;
  }

  return Array.from(related.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.entry);
}
