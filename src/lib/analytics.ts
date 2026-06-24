/**
 * Camada de abstração de analytics.
 * Hoje: console (dev).
 * Futuro: GA4, Mixpanel, PostHog — basta plugar aqui.
 */

type EventName =
  | 'chord_viewed'
  | 'chord_played'
  | 'instrument_changed'
  | 'inversion_changed'
  | 'voicing_changed'
  | 'search_performed'
  | 'exercise_started'
  | 'exercise_completed'
  | 'pwa_installed';

interface EventPayload {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(name: EventName, payload?: EventPayload) {
  if (import.meta.env.DEV) {
    console.log(`📊 [Analytics] ${name}`, payload);
  }
}
