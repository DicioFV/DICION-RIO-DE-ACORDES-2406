import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Star, Trophy, ChevronRight, RotateCcw, ArrowLeft, Lightbulb } from 'lucide-react';
import { MODULOS_CONFIG, criarSessao, processarResposta, finalizarSessao } from '@/lib/exercicios/engine';
import { carregarPerfil } from '@/lib/exercicios/persistencia';
import { calcularNivel } from '@/lib/exercicios/pontuacao';
import { getConquista } from '@/lib/exercicios/conquistas';
import { NIVEIS_RECONHECIMENTO } from '@/lib/exercicios/reconhecimento/niveis';
import { NIVEIS_INTERVALOS } from '@/lib/exercicios/intervalos/niveis';
import { INTERVALOS_DATABASE } from '@/lib/exercicios/intervalos/database';
import { obterEstatisticas } from '@/lib/exercicios/intervalos/estatisticas';
import type { PerfilJogador, SessaoExercicio, ModuloId, ModoSessao, Dificuldade, Questao, ConfigModulo } from '@/lib/exercicios/tipos';
import { navigateTo } from '@/hooks/useRouter';

interface Props { moduloSlug?: string | null; }

export function ExercisesPage({ moduloSlug }: Props) {
  const [perfil, setPerfil] = useState<PerfilJogador | null>(null);
  const [sessao, setSessao] = useState<SessaoExercicio | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; text: string; correct: boolean; xp: number }>({ show: false, text: '', correct: false, xp: 0 });
  const [resultado, setResultado] = useState<{ sessao: SessaoExercicio; conquistas: string[] } | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => { setPerfil(carregarPerfil()); }, []);

  const iniciar = useCallback((moduloId: ModuloId, modo: ModoSessao, dif: Dificuldade) => {
    const s = criarSessao({ moduloId, modo, dificuldade: dif });
    setSessao(s);
    setResultado(null);
    setFeedback({ show: false, text: '', correct: false, xp: 0 });
    startTimeRef.current = Date.now();
  }, []);

  const responder = useCallback((resposta: string) => {
    if (!sessao || feedback.show) return;
    const tempo = Date.now() - startTimeRef.current;
    const { sessaoAtualizada, correta, xpGanho, feedbackTexto } = processarResposta(sessao, resposta, tempo, false);
    setSessao(sessaoAtualizada);
    setFeedback({ show: true, text: feedbackTexto, correct: correta, xp: xpGanho });
  }, [sessao, feedback.show]);

  const proxima = useCallback(() => {
    if (!sessao) return;
    if (sessao.questaoAtualIdx >= sessao.totalQuestoes) {
      const { sessao: final, perfilAtualizado, conquistasNovas } = finalizarSessao(sessao);
      setPerfil(perfilAtualizado);
      setResultado({ sessao: final, conquistas: conquistasNovas });
      setSessao(null);
    } else {
      setFeedback({ show: false, text: '', correct: false, xp: 0 });
      startTimeRef.current = Date.now();
    }
  }, [sessao]);

  // If a specific module was requested via route
  if (moduloSlug && !sessao && !resultado) {
    const modulo = Object.values(MODULOS_CONFIG).find((m) => m.id === moduloSlug);
    if (modulo) {
      return <ModuleSetup modulo={modulo} onStart={iniciar} onBack={() => navigateTo('/exercicios')} />;
    }
  }

  // Active session
  if (sessao && !resultado) {
    const questao = sessao.questoes[sessao.questaoAtualIdx];
    if (!questao) { proxima(); return null; }
    return <SessionView sessao={sessao} questao={questao} feedback={feedback} onResponder={responder} onProxima={proxima} onAbandonar={() => { setSessao(null); setFeedback({ show: false, text: '', correct: false, xp: 0 }); }} />;
  }

  // Result screen
  if (resultado) {
    return <ResultView resultado={resultado} onReiniciar={() => { setResultado(null); }} />;
  }

  // Hub
  return <ExerciseHub perfil={perfil} onSelectModule={(id) => navigateTo(`/exercicios/${id}`)} />;
}

// ======================== HUB ========================

function ExerciseHub({ perfil, onSelectModule }: { perfil: PerfilJogador | null; onSelectModule: (id: ModuloId) => void }) {
  const modulos = Object.values(MODULOS_CONFIG);
  const nivelInfo = perfil ? calcularNivel(perfil.xpTotal) : null;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/20 via-accent/10 to-background py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-3">Exercícios de <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Harmonia</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Treine reconhecimento de acordes, intervalos e progressões. Sistema gamificado com XP, conquistas e streak diário.</p>

          {/* Stats */}
          {perfil && nivelInfo && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-2xl mx-auto">
              {[
                { l: 'Nível', v: `${nivelInfo.nivel}`, i: <Star className="h-5 w-5 text-amber-400" /> },
                { l: 'XP Total', v: `${perfil.xpTotal}`, i: <Zap className="h-5 w-5 text-indigo-400" /> },
                { l: 'Streak', v: `${perfil.streakAtual}d`, i: <Flame className="h-5 w-5 text-orange-400" /> },
                { l: 'Sessões', v: `${perfil.sessoesTotal}`, i: <Trophy className="h-5 w-5 text-green-400" /> },
              ].map(({ l, v, i }) => (
                <div key={l} className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
                  <div className="flex justify-center mb-2">{i}</div>
                  <div className="text-2xl font-black">{v}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Level bar */}
          {nivelInfo && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{nivelInfo.titulo}</span>
                <span>{nivelInfo.progresso}% para nível {nivelInfo.nivel + 1}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${nivelInfo.progresso}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold mb-6">Módulos de Exercício</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modulos.map((m, idx) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <button onClick={() => onSelectModule(m.id)}
                className="w-full text-left rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg transition cursor-pointer group">
                <div className={`bg-gradient-to-r ${m.cor} p-5`}>
                  <span className="text-3xl">{m.emoji}</span>
                  <h3 className="text-xl font-black text-white mt-1">{m.nome}</h3>
                  <p className="text-white/70 text-sm">{m.descricao}</p>
                </div>
                <div className="bg-card p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{m.questoesPorSessao} questões por sessão</span>
                  <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Começar <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Streak */}
      {perfil && perfil.streakAtual > 0 && (
        <section className="max-w-md mx-auto px-4 pb-12">
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-black">{perfil.streakAtual} {perfil.streakAtual === 1 ? 'dia' : 'dias'}</div>
            <div className="text-sm text-muted-foreground">de estudo consecutivo</div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1"><Trophy className="h-3 w-3" /> Recorde: {perfil.melhorStreak} dias</div>
          </div>
        </section>
      )}
    </div>
  );
}

// ======================== MODULE SETUP ========================

function ModuleSetup({ modulo, onStart, onBack }: { modulo: ConfigModulo; onStart: (id: ModuloId, modo: ModoSessao, dif: Dificuldade) => void; onBack: () => void }) {
  const [dif, setDif] = useState<Dificuldade>('iniciante');
  const [modo, setModo] = useState<ModoSessao>('treino');

  const isRecognition = modulo.id === 'reconhecimento-visual';
  const isIntervals = modulo.id === 'intervalos';
  const recNivel = isRecognition ? NIVEIS_RECONHECIMENTO.find((n) => n.id === dif) : null;
  const ivNivel = isIntervals ? NIVEIS_INTERVALOS.find((n) => n.id === dif) : null;
  const ivStats = isIntervals ? obterEstatisticas() : [];

  const dificuldades: { id: Dificuldade; label: string; emoji: string }[] = isRecognition
    ? NIVEIS_RECONHECIMENTO.map((n) => ({ id: n.id as Dificuldade, label: n.nome, emoji: n.emoji }))
    : isIntervals
    ? NIVEIS_INTERVALOS.map((n) => ({ id: n.id as Dificuldade, label: n.nome, emoji: n.emoji }))
    : [
        { id: 'iniciante', label: 'Iniciante', emoji: '🌱' },
        { id: 'basico', label: 'Básico', emoji: '⭐' },
        { id: 'intermediario', label: 'Intermediário', emoji: '🔥' },
        { id: 'avancado', label: 'Avançado', emoji: '💎' },
        { id: 'mestre', label: 'Mestre', emoji: '👑' },
      ];

  const modos: { id: ModoSessao; label: string; desc: string; emoji: string }[] = [
    { id: 'treino', label: 'Treino', desc: 'Sem pressão, com dicas', emoji: '📚' },
    { id: 'desafio', label: 'Desafio', desc: '30s por questão, 1.5× XP', emoji: '⏱️' },
    { id: 'revisao', label: 'Revisão', desc: 'Foco em pontos fracos', emoji: '🔄' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className={`bg-gradient-to-r ${modulo.cor} rounded-2xl p-6 mb-8 text-center`}>
        <span className="text-5xl">{modulo.emoji}</span>
        <h1 className="text-2xl font-black text-white mt-2">{modulo.nome}</h1>
        <p className="text-white/70">{modulo.descricao}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-3">Dificuldade</h3>
          <div className={`grid ${isRecognition ? 'grid-cols-5' : 'grid-cols-5'} gap-2`}>
            {dificuldades.map((d) => (
              <button key={d.id} onClick={() => setDif(d.id)}
                className={`p-3 rounded-xl text-center transition cursor-pointer ${dif === d.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:border-primary/40'}`}>
                <div className="text-lg">{d.emoji}</div>
                <div className="text-[10px] font-semibold mt-1">{d.label}</div>
              </button>
            ))}
          </div>

          {/* Recognition level details */}
          {recNivel && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={recNivel.id}
              className="mt-3 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="font-bold text-sm mb-1">{recNivel.emoji} Nível {recNivel.numero}: {recNivel.subtitulo}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {recNivel.qualidades.map((q) => (
                  <span key={q} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                    {q === '' ? 'Maior' : q === 'm' ? 'Menor' : q}
                  </span>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">💡 {recNivel.dicasGerais[0]}</div>
              <div className="text-xs text-muted-foreground mt-1">🎵 Tonalidades: {recNivel.tonalidades.join(', ')} • {recNivel.xpPorQuestao} XP/questão</div>
            </motion.div>
          )}

          {/* Interval level details */}
          {ivNivel && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={ivNivel.id}
              className="mt-3 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="font-bold text-sm mb-1">{ivNivel.emoji} Nível {ivNivel.numero}: {ivNivel.subtitulo}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {ivNivel.semitons.map((st) => {
                  const iv = INTERVALOS_DATABASE.find((i) => i.semitons === st);
                  return iv ? (
                    <span key={st} className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: iv.corHex }}>
                      {iv.nomeAbreviado}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="text-xs text-muted-foreground">💡 {ivNivel.dicas[0]}</div>
              <div className="text-xs text-muted-foreground mt-1">
                🎯 Direções: {ivNivel.direcoes.join(', ')} • {ivNivel.xpPorQuestao} XP/questão
              </div>
              {/* Mini stats if available */}
              {ivStats.filter((s) => s.total > 0 && ivNivel.semitons.includes(INTERVALOS_DATABASE.find((i) => i.id === s.id)?.semitons || -1)).length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-[10px] text-muted-foreground mb-1">Seu progresso:</div>
                  <div className="flex flex-wrap gap-1">
                    {ivStats.filter((s) => s.total > 0).slice(0, 6).map((s) => (
                      <span key={s.id} className={`text-[10px] px-1.5 py-0.5 rounded ${s.precisao >= 80 ? 'bg-green-500/20 text-green-600' : s.precisao >= 50 ? 'bg-amber-500/20 text-amber-600' : 'bg-red-500/20 text-red-600'}`}>
                        {s.abrev} {s.precisao}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div>
          <h3 className="font-bold mb-3">Modo</h3>
          <div className="space-y-2">
            {modos.map((m) => (
              <button key={m.id} onClick={() => setModo(m.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition cursor-pointer text-left ${modo === m.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:border-primary/40'}`}>
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <div className="font-bold">{m.label}</div>
                  <div className={`text-xs ${modo === m.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onStart(modulo.id, modo, dif)}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg hover:shadow-xl transition cursor-pointer">
          🚀 Iniciar Sessão
        </button>
      </div>
    </div>
  );
}

// ======================== SESSION VIEW ========================

function SessionView({ sessao, questao, feedback, onResponder, onProxima, onAbandonar }: {
  sessao: SessaoExercicio; questao: Questao;
  feedback: { show: boolean; text: string; correct: boolean; xp: number };
  onResponder: (r: string) => void; onProxima: () => void; onAbandonar: () => void;
}) {
  const progresso = Math.round((sessao.questaoAtualIdx / sessao.totalQuestoes) * 100);
  const modulo = MODULOS_CONFIG[sessao.moduloId];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onAbandonar} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Sair
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{sessao.questaoAtualIdx + 1}/{sessao.totalQuestoes}</span>
          <div className="flex items-center gap-1 text-amber-500"><Zap className="h-4 w-4" /><span className="font-bold text-sm">{sessao.xpGanho}</span></div>
          {sessao.sequenciaAtual >= 3 && (
            <div className="flex items-center gap-1 text-orange-500"><Flame className="h-4 w-4" /><span className="font-bold text-sm">{sessao.sequenciaAtual}</span></div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${modulo.cor}`} animate={{ width: `${progresso}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Question */}
      <motion.div key={questao.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{modulo.emoji}</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">{modulo.nome}</span>
        </div>
        <h2 className="text-xl font-bold mb-2">{questao.enunciado}</h2>
        {questao.enunciadoDetalhe && <p className="text-sm text-muted-foreground mb-4">{questao.enunciadoDetalhe}</p>}

        {/* Multiple choice options */}
        {questao.opcoes && !feedback.show && (
          <div className="space-y-2">
            {questao.opcoes.map((opt) => (
              <button key={opt.id} onClick={() => onResponder(opt.id)} disabled={feedback.show}
                className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition cursor-pointer font-medium">
                {opt.texto}
              </button>
            ))}
          </div>
        )}

        {/* Show correct/wrong after answering MC */}
        {questao.opcoes && feedback.show && (
          <div className="space-y-2">
            {questao.opcoes.map((opt) => (
              <div key={opt.id}
                className={`p-4 rounded-xl border-2 font-medium ${
                  opt.ehCorreta ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300' : 'border-border opacity-50'
                }`}>
                {opt.texto} {opt.ehCorreta && '✅'}
              </div>
            ))}
          </div>
        )}

        {/* Typing input for digitacao questions */}
        {questao.tipo === 'digitacao' && !feedback.show && (
          <TypingInput onSubmit={(val) => onResponder(val)} />
        )}

        {/* Hint */}
        {!feedback.show && questao.dica && sessao.modo === 'treino' && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 shrink-0" /> {questao.dica}
          </div>
        )}
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback.show && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 rounded-xl mb-6 ${feedback.correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${feedback.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {feedback.text}
              </p>
              {feedback.xp > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Zap className="h-4 w-4" /> +{feedback.xp}
                </motion.span>
              )}
            </div>
            <button onClick={onProxima} className="mt-3 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm cursor-pointer hover:bg-primary/90 transition">
              {sessao.questaoAtualIdx >= sessao.totalQuestoes ? '📊 Ver Resultado' : 'Próxima →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ======================== RESULT ========================

function ResultView({ resultado, onReiniciar }: { resultado: { sessao: SessaoExercicio; conquistas: string[] }; onReiniciar: () => void }) {
  const { sessao, conquistas } = resultado;
  const precisao = Math.round((sessao.acertos / sessao.totalQuestoes) * 100);
  const modulo = MODULOS_CONFIG[sessao.moduloId];
  const medalha = precisao === 100 ? '🥇' : precisao >= 80 ? '🥈' : precisao >= 60 ? '🥉' : '📚';

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-8xl text-center mb-6">{medalha}</motion.div>

      <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
        <div className={`bg-gradient-to-r ${modulo.cor} p-6 text-center`}>
          <h2 className="text-2xl font-black text-white">{precisao === 100 ? 'Perfeito!' : precisao >= 80 ? 'Excelente!' : precisao >= 60 ? 'Muito bom!' : 'Continue praticando!'}</h2>
          <p className="text-white/70">{modulo.nome}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { l: 'Acertos', v: `${sessao.acertos}/${sessao.totalQuestoes}`, c: 'text-green-600' },
              { l: 'Precisão', v: `${precisao}%`, c: 'text-indigo-600' },
              { l: 'Sequência', v: `${sessao.melhorSequencia}`, c: 'text-orange-600' },
            ].map(({ l, v, c }) => (
              <div key={l} className="text-center bg-muted/50 rounded-xl p-3">
                <div className={`text-2xl font-black ${c}`}>{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-amber-500/10 rounded-xl p-4 mb-4 border border-amber-500/20">
            <span className="font-bold flex items-center gap-2"><Zap className="h-5 w-5 text-amber-500" /> XP Ganho</span>
            <span className="text-2xl font-black text-amber-600">+{sessao.xpGanho}</span>
          </div>

          {/* Achievements */}
          {conquistas.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">🏆 Conquistas!</h4>
              {conquistas.map((id) => {
                const c = getConquista(id);
                if (!c) return null;
                return (
                  <motion.div key={id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 bg-amber-500/5 rounded-xl p-3 mb-2 border border-amber-500/20">
                    <span className="text-2xl">{c.emoji}</span>
                    <div>
                      <div className="font-bold text-sm">{c.nome}</div>
                      <div className="text-xs text-muted-foreground">+{c.xpBonus} XP</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onReiniciar} className="flex-1 py-3 rounded-xl bg-muted font-medium hover:bg-muted/80 transition cursor-pointer flex items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" /> Repetir
            </button>
            <button onClick={() => navigateTo('/exercicios')} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition cursor-pointer flex items-center justify-center gap-2">
              Módulos <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== TYPING INPUT ========================

function TypingInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input ref={inputRef} type="text" value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="Ex: Cmaj7, Am, G7..." autoComplete="off" spellCheck={false}
        className="flex-1 px-4 py-3 text-lg font-mono font-bold text-center bg-muted border-2 border-border rounded-xl focus:border-primary focus:outline-none" />
      <button type="submit" disabled={!value.trim()}
        className={`px-6 py-3 rounded-xl font-semibold transition cursor-pointer ${value.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
        Enviar
      </button>
    </form>
  );
}
