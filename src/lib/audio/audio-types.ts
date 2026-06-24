/**
 * ============================================================
 * TIPOS DO MOTOR DE ÁUDIO
 * ============================================================
 */

export type AudioInstrumentId =
  | 'piano-acoustic'
  | 'piano-bright'
  | 'piano-warm'
  | 'epiano'
  | 'guitar-nylon'
  | 'guitar-steel'
  | 'guitar-electric'
  | 'ukulele'
  | 'cavaquinho'
  | 'mandolin'
  | 'organ'
  | 'strings'
  | 'pad';

export type PlaybackMode =
  | 'block'
  | 'arpeggio-up'
  | 'arpeggio-down'
  | 'arpeggio-updown'
  | 'strum-down'
  | 'strum-up'
  | 'note-by-note';

export interface AudioPreset {
  id: AudioInstrumentId;
  name: string;
  category: 'piano' | 'guitar' | 'small-strings' | 'keyboard' | 'orchestral';
  sampleBaseUrl: string;
  sampleFormat: 'mp3' | 'ogg';
  sampleNotes: string[];
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  defaultVolume: number;
  defaultReverb: number;
}

export interface PlaybackConfig {
  mode: PlaybackMode;
  velocity: number;
  tempo: number;
  sustain: number;
}
