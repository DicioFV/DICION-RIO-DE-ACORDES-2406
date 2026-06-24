/**
 * ============================================================
 * FEATURE FLAGS POR PLANO
 * ============================================================
 */
import type { PlanoId } from './config';
import { temAcesso } from './config';

export type Feature =
  | 'acordes-basicos' | 'acordes-completos' | 'todos-instrumentos'
  | 'exercicios-iniciante' | 'exercicios-intermediario' | 'exercicios-avancado' | 'exercicios-mestre'
  | 'inversoes' | 'voicings-avancados' | 'progressoes' | 'sem-anuncios'
  | 'audio-premium' | 'campo-harmonico' | 'favoritos-ilimitados';

const FEATURE_PLANO: Record<Feature, PlanoId> = {
  'acordes-basicos': 'gratis',
  'exercicios-iniciante': 'gratis',
  'acordes-completos': 'pro',
  'todos-instrumentos': 'pro',
  'exercicios-intermediario': 'pro',
  'sem-anuncios': 'pro',
  'favoritos-ilimitados': 'pro',
  'inversoes': 'pro',
  'campo-harmonico': 'pro',
  'exercicios-avancado': 'pro',
  'progressoes': 'master',
  'exercicios-mestre': 'master',
  'voicings-avancados': 'master',
  'audio-premium': 'premium',
};

export function podeAcessar(plano: PlanoId, feature: Feature): boolean {
  return temAcesso(plano, FEATURE_PLANO[feature]);
}

export function getFeaturePlano(feature: Feature): PlanoId {
  return FEATURE_PLANO[feature];
}
