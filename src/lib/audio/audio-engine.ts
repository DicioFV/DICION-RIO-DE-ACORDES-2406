import type { AudioInstrumentId } from './audio-types';
import { getPreset } from './audio-presets';

/**
 * ============================================================
 * MOTOR CENTRAL DE ÁUDIO
 *
 * - Manages Tone.js initialization
 * - Lazy loads samplers per instrument
 * - Provides master effects chain
 * - Browser gesture-gated initialization
 * ============================================================
 */

let toneModule: typeof import('tone') | null = null;
let initialized = false;
let masterVolume = 0.75;
let masterMuted = false;

// Cache of loaded samplers
const samplerCache = new Map<AudioInstrumentId, any>();
const loadingPromises = new Map<AudioInstrumentId, Promise<any>>();

/**
 * Initialize the audio engine (must be called after user gesture)
 */
export async function initAudioEngine(): Promise<void> {
  if (initialized) return;

  toneModule = await import('tone');

  if (toneModule.getContext().state !== 'running') {
    await toneModule.start();
  }

  initialized = true;
  console.log('🔊 Motor de áudio inicializado');
}

export async function ensureInitialized(): Promise<void> {
  if (!initialized) await initAudioEngine();
}

export function isAudioInitialized(): boolean {
  return initialized;
}

/**
 * Load a sampler for a specific instrument (with cache)
 */
export async function loadSampler(
  instrumentId: AudioInstrumentId,
  onProgress?: (progress: number) => void
): Promise<any> {
  // Already loaded
  if (samplerCache.has(instrumentId)) {
    onProgress?.(1);
    return samplerCache.get(instrumentId);
  }

  // Currently loading - wait for existing promise
  if (loadingPromises.has(instrumentId)) {
    return loadingPromises.get(instrumentId);
  }

  const promise = doLoadSampler(instrumentId, onProgress);
  loadingPromises.set(instrumentId, promise);

  try {
    const sampler = await promise;
    samplerCache.set(instrumentId, sampler);
    return sampler;
  } finally {
    loadingPromises.delete(instrumentId);
  }
}

async function doLoadSampler(
  instrumentId: AudioInstrumentId,
  onProgress?: (progress: number) => void
): Promise<any> {
  await ensureInitialized();
  if (!toneModule) throw new Error('Tone.js not loaded');

  const preset = getPreset(instrumentId);

  // Build sample URL map
  const urls: Record<string, string> = {};
  for (const note of preset.sampleNotes) {
    const filename = note.replace('#', 's') + '.' + preset.sampleFormat;
    urls[note] = filename;
  }

  return new Promise((resolve, reject) => {
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 0.08, 0.9);
      onProgress?.(progress);
    }, 100);

    const sampler = new toneModule!.Sampler({
      urls,
      baseUrl: preset.sampleBaseUrl,
      release: preset.envelope.release,
      onload: () => {
        clearInterval(interval);
        onProgress?.(1);

        // Connect to destination with volume
        sampler.toDestination();
        sampler.volume.value = preset.defaultVolume;

        resolve(sampler);
      },
      onerror: (err: Error) => {
        clearInterval(interval);
        reject(err);
      },
    });
  });
}

/**
 * Check if a sampler is loaded
 */
export function isSamplerLoaded(instrumentId: AudioInstrumentId): boolean {
  return samplerCache.has(instrumentId);
}

/**
 * Get a loaded sampler (synchronous, returns null if not loaded)
 */
export function getSampler(instrumentId: AudioInstrumentId): any | null {
  return samplerCache.get(instrumentId) ?? null;
}

/**
 * Set master volume (0-1)
 */
export function setMasterVolume(volume: number): void {
  masterVolume = volume;
  if (!toneModule) return;
  const db = volume <= 0 ? -Infinity : 20 * Math.log10(volume);
  toneModule.getDestination().volume.value = db;
}

/**
 * Set master mute
 */
export function setMasterMute(muted: boolean): void {
  masterMuted = muted;
  if (!toneModule) return;
  toneModule.getDestination().mute = muted;
}

export function getMasterVolume(): number {
  return masterVolume;
}

export function isMasterMuted(): boolean {
  return masterMuted;
}

/**
 * Convert MIDI number to note name
 */
export function midiToToneNote(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[midi % 12]}${octave}`;
}

/**
 * Stop all sounds
 */
export function stopAll(): void {
  if (!toneModule) return;
  toneModule.getTransport().stop();
  toneModule.getTransport().cancel();
}

/**
 * Clear sampler cache
 */
export function clearAudioCache(): void {
  for (const sampler of samplerCache.values()) {
    try {
      sampler.dispose();
    } catch {
      // Ignore disposal errors
    }
  }
  samplerCache.clear();
}
