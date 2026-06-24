import type { Note, Pitch, Octave } from '../types';
import { A4_FREQUENCY, A4_MIDI, SHARP_NAMES, FLAT_NAMES } from './constants';
import { createNote } from './notes';

/**
 * ============================================================
 * PITCH ABSOLUTO — Notas com oitava, MIDI e frequência
 * ============================================================
 */

/**
 * Calcula o número MIDI de uma nota numa oitava.
 * Convenção: C-1 = 0, A4 = 69, C4 = 60 (dó central)
 */
export function noteToMidi(note: Note, octave: Octave): number {
  return (octave + 1) * 12 + note.pitchClass;
}

/**
 * Converte número MIDI em pitch (nota + oitava)
 */
export function midiToPitch(midi: number, preferFlats = false): Pitch {
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = midi % 12;

  const names = preferFlats ? FLAT_NAMES : SHARP_NAMES;
  const note = createNote(names[pitchClass]);

  return createPitch(note, octave);
}

/**
 * Calcula a frequência em Hz a partir do MIDI
 * Fórmula: f = 440 * 2^((midi - 69) / 12)
 */
export function midiToFrequency(midi: number): number {
  return A4_FREQUENCY * Math.pow(2, (midi - A4_MIDI) / 12);
}

/**
 * Converte frequência em número MIDI (pode não ser inteiro)
 */
export function frequencyToMidi(frequency: number): number {
  return A4_MIDI + 12 * Math.log2(frequency / A4_FREQUENCY);
}

/**
 * Cria um pitch completo
 */
export function createPitch(note: Note, octave: Octave): Pitch {
  const midi = noteToMidi(note, octave);
  return {
    note,
    octave,
    midi,
    frequency: midiToFrequency(midi),
  };
}

/**
 * Notação científica (ex: "C4", "F#5")
 */
export function pitchToString(pitch: Pitch): string {
  return `${pitch.note.name}${pitch.octave}`;
}

/**
 * Faz parse de string científica → Pitch
 * Ex: "C4" → Pitch
 */
export function parsePitch(str: string): Pitch {
  const match = str.match(/^([A-G](?:##|bb|#|b)?)(-?\d+)$/);
  if (!match) throw new Error(`Pitch inválido: ${str}`);
  return createPitch(createNote(match[1]), parseInt(match[2], 10));
}

/**
 * Transpõe um pitch por N semitons
 */
export function transposePitch(pitch: Pitch, semitones: number, preferFlats = false): Pitch {
  const newMidi = pitch.midi + semitones;
  return midiToPitch(newMidi, preferFlats);
}

/**
 * Distância em semitons entre dois pitches
 */
export function pitchDistance(from: Pitch, to: Pitch): number {
  return to.midi - from.midi;
}

/**
 * Verifica se dois pitches são iguais
 */
export function pitchesEqual(a: Pitch, b: Pitch): boolean {
  return a.midi === b.midi;
}

/**
 * Gera uma série de pitches (útil para representar um teclado)
 */
export function generatePitchRange(startMidi: number, endMidi: number, preferFlats = false): Pitch[] {
  const pitches: Pitch[] = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    pitches.push(midiToPitch(midi, preferFlats));
  }
  return pitches;
}
