import { ptBR } from './pt-BR';

export const IDIOMAS = { 'pt-BR': ptBR } as const;
export type Idioma = keyof typeof IDIOMAS;
export const IDIOMA_PADRAO: Idioma = 'pt-BR';

export function useT(idioma: Idioma = IDIOMA_PADRAO) {
  return { t: IDIOMAS[idioma] };
}
