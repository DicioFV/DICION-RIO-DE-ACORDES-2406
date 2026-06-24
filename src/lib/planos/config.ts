/**
 * ============================================================
 * PLANOS DE ASSINATURA
 * ============================================================
 */

export type PlanoId = 'gratis' | 'pro' | 'master' | 'premium' | 'vip';

export interface Plano {
  id: PlanoId;
  nome: string;
  emoji: string;
  preco: number;
  precoAnual?: number;
  cor: string;
  descricao: string;
  recursos: { label: string; incluido: boolean }[];
  destaque?: boolean;
}

export const PLANOS: Record<PlanoId, Plano> = {
  gratis: {
    id: 'gratis', nome: 'Grátis', emoji: '🆓', preco: 0, cor: 'from-slate-500 to-slate-600',
    descricao: 'Para quem está começando',
    recursos: [
      { label: 'Tríades e tétrades básicas', incluido: true },
      { label: '1 instrumento (piano)', incluido: true },
      { label: 'Exercícios iniciante e básico', incluido: true },
      { label: 'Glossário completo', incluido: true },
      { label: 'Acordes avançados', incluido: false },
      { label: 'Todos os instrumentos', incluido: false },
      { label: 'Sem anúncios', incluido: false },
    ],
  },
  pro: {
    id: 'pro', nome: 'PRO', emoji: '⭐', preco: 9.90, precoAnual: 89.90, cor: 'from-blue-500 to-indigo-600',
    descricao: 'Para músicos em desenvolvimento',
    recursos: [
      { label: 'Todos os acordes (42+ qualidades)', incluido: true },
      { label: 'Todos os instrumentos (6)', incluido: true },
      { label: 'Exercícios até avançado', incluido: true },
      { label: 'Sem anúncios', incluido: true },
      { label: 'Inversões e função harmônica', incluido: true },
      { label: 'Voicings avançados', incluido: false },
    ],
  },
  master: {
    id: 'master', nome: 'Master', emoji: '💎', preco: 17.90, precoAnual: 159.90, cor: 'from-violet-500 to-purple-600',
    descricao: 'Para músicos sérios', destaque: true,
    recursos: [
      { label: 'Tudo do PRO', incluido: true },
      { label: 'Voicings profissionais', incluido: true },
      { label: 'Progressões e rearmonização', incluido: true },
      { label: 'Exercícios nível mestre', incluido: true },
      { label: 'Áudio premium', incluido: false },
    ],
  },
  premium: {
    id: 'premium', nome: 'Premium', emoji: '👑', preco: 29.90, precoAnual: 269.90, cor: 'from-amber-500 to-orange-600',
    descricao: 'O pacote completo',
    recursos: [
      { label: 'Tudo do Master', incluido: true },
      { label: 'Áudio premium HD', incluido: true },
      { label: 'Conteúdo pedagógico completo', incluido: true },
      { label: 'Suporte prioritário', incluido: true },
      { label: 'Badge exclusivo', incluido: true },
    ],
  },
  vip: {
    id: 'vip', nome: 'Aluno VIP', emoji: '🎓', preco: 0, cor: 'from-emerald-500 to-teal-600',
    descricao: 'Acesso vitalício para alunos',
    recursos: [
      { label: 'Acesso total (= Premium)', incluido: true },
      { label: 'Válido por 12 meses', incluido: true },
      { label: 'Sem cobrança', incluido: true },
    ],
  },
};

export const HIERARQUIA: PlanoId[] = ['gratis', 'pro', 'master', 'premium', 'vip'];

export function temAcesso(planoUsuario: PlanoId, planoNecessario: PlanoId): boolean {
  if (planoUsuario === 'vip') return true;
  return HIERARQUIA.indexOf(planoUsuario) >= HIERARQUIA.indexOf(planoNecessario);
}
