/**
 * ============================================================
 * CÁLCULO DE FREQUÊNCIAS POR OITAVA
 * f(n) = 440 × 2^((n-69)/12) onde n = MIDI
 * ============================================================
 */

export interface NotaOitava {
  oitava: number;
  midi: number;
  frequencia: number;
  frequenciaFormatada: string;
  descricaoOitava: string;
  nomeCompleto: string;
}

const MIDI_C0 = 12;

const DESCRICOES_OITAVA: Record<number, string> = {
  0: 'Subcontroitava (infrassônico)',
  1: 'Controitava (muito grave)',
  2: 'Grande oitava (grave)',
  3: 'Pequena oitava (médio-grave)',
  4: 'Oitava central (registro vocal)',
  5: 'Oitava aguda (médio-agudo)',
  6: 'Oitava muito aguda',
  7: 'Oitava extremo agudo',
  8: 'Limite superior',
};

export function calcularFrequencia(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function formatarFrequencia(hz: number): string {
  return `${hz.toFixed(2).replace('.', ',')} Hz`;
}

export function gerarOitavasDaNota(
  posicaoCromatica: number,
  simbolo: string,
  oitavas: number[] = [2, 3, 4, 5, 6]
): NotaOitava[] {
  return oitavas.map((oitava) => {
    const midi = MIDI_C0 + oitava * 12 + posicaoCromatica;
    const frequencia = calcularFrequencia(midi);
    const ehCentral = simbolo === 'C' && oitava === 4;

    return {
      oitava,
      midi,
      frequencia,
      frequenciaFormatada: formatarFrequencia(frequencia),
      descricaoOitava: DESCRICOES_OITAVA[oitava] || '',
      nomeCompleto: ehCentral
        ? `${simbolo.split('/')[0]}${oitava} (Dó central)`
        : `${simbolo.split('/')[0]}${oitava}`,
    };
  });
}

export function getOitavaDestaque(posicaoCromatica: number): number {
  if (posicaoCromatica === 9) return 4; // A4 = 440Hz
  return 4;
}
