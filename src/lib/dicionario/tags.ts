/**
 * ============================================================
 * SISTEMA DE TAGS MUSICAIS
 * ============================================================
 */

export interface TagMusical {
  id: string;
  label: string;
  emoji: string;
  cor: string;
}

export const TAGS_MUSICAIS: TagMusical[] = [
  { id: 'jazz', label: 'Jazz', emoji: '🎷', cor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
  { id: 'gospel', label: 'Gospel', emoji: '✝️', cor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300' },
  { id: 'pop', label: 'Pop', emoji: '🎵', cor: 'bg-pink-500/15 text-pink-700 dark:text-pink-300' },
  { id: 'mpb', label: 'MPB', emoji: '🇧🇷', cor: 'bg-green-500/15 text-green-700 dark:text-green-300' },
  { id: 'rock', label: 'Rock', emoji: '🎸', cor: 'bg-red-500/15 text-red-700 dark:text-red-300' },
  { id: 'bossa-nova', label: 'Bossa', emoji: '🌊', cor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300' },
  { id: 'samba', label: 'Samba', emoji: '🥁', cor: 'bg-orange-500/15 text-orange-700 dark:text-orange-300' },
  { id: 'blues', label: 'Blues', emoji: '🎺', cor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300' },
  { id: 'worship', label: 'Worship', emoji: '🙌', cor: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
  { id: 'folk', label: 'Folk', emoji: '🌿', cor: 'bg-lime-500/15 text-lime-700 dark:text-lime-300' },
];

export function getTagById(id: string): TagMusical | undefined {
  return TAGS_MUSICAIS.find((t) => t.id === id);
}
