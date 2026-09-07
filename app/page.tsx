'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Copy,
  Flame,
  Gamepad2,
  Home,
  LogOut,
  Menu,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import {
  getPhase,
  getSession,
  gamePrompts,
  skills,
  type Skill,
} from '@/lib/plan';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';

type View = 'today' | 'calendar' | 'lab' | 'progress';
type Game = 'attention' | 'flexibility' | 'spatial' | 'verbal';
type Stored = {
  xp: number;
  streak: number;
  completed: string[];
  scores: Record<string, number[]>;
};
const initial: Stored = {
  xp: 840,
  streak: 6,
  completed: ['w1d1', 'w1d2', 'w1d3', 'w1d4', 'w1d5', 'w1d6'],
  scores: {
    Atenção: [62, 68, 71, 77],
    Flexibilidade: [58, 61, 70],
    Visuoespacial: [72, 78, 82],
    Verbal: [60, 67],
  },
};
const nav = [
  { id: 'today', label: 'Hoje', icon: Home },
  { id: 'calendar', label: 'Jornada', icon: CalendarDays },
  { id: 'lab', label: 'Laboratório', icon: Gamepad2 },
  { id: 'progress', label: 'Progresso', icon: BarChart3 },
] as const;

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <i />
      </span>
      <span>ÓRBITA</span>
    </div>
  );
}

export default function HomePage() {
  const [view, setView] = useState<View>('today'),
    [week, setWeek] = useState(2),
    [day, setDay] = useState(0);
  const [data, setData] = useState<Stored>(initial),
    [game, setGame] = useState<Game | null>(null),
    [menu, setMenu] = useState(false),
    [login, setLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null),
    [toast, setToast] = useState('');
  useEffect(() => {
    const raw = localStorage.getItem('orbita-progress');
    if (raw) queueMicrotask(() => setData(JSON.parse(raw)));
    const s = getSupabase();
    if (s) {
      void s.auth
        .getUser()
        .then(({ data: d }) => setUserEmail(d.user?.email ?? null));
      const { data: l } = s.auth.onAuthStateChange((_e, x) =>
        setUserEmail(x?.user.email ?? null),
      );
      return () => l.subscription.unsubscribe();
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('orbita-progress', JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  const level = Math.floor(data.xp / 500) + 1;
  const completeSession = async () => {
    const key = `w${week}d${day + 1}`;
    if (data.completed.includes(key)) return setToast('Sessão já registrada');
    setData({
      ...data,
      xp: data.xp + 160,
      streak: data.streak + 1,
      completed: [...data.completed, key],
    });
    setToast('+160 XP · missão concluída');
    const s = getSupabase();
    if (s && userEmail) {
      const { data: a } = await s.auth.getUser();
      if (a.user)
        await s
          .from('session_logs')
          .upsert({
            user_id: a.user.id,
            session_key: key,
            week_number: week,
            day_number: day + 1,
            minutes: 45,
            xp: 160,
          });
    }
  };
  const content =
    view === 'today' ? (
      <Today
        week={week}
        day={day}
        setDay={setDay}
        completed={data.completed}
        onPlay={setGame}
        onComplete={completeSession}
      />
    ) : view === 'calendar' ? (
      <Journey week={week} setWeek={setWeek} completed={data.completed} />
    ) : view === 'lab' ? (
      <Lab onPlay={setGame} />
    ) : (
      <Progress data={data} />
    );
  return (
    <main className="app-shell">
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <div className="side-top">
          <Logo />
          <button
            className="icon-btn close-menu"
            onClick={() => setMenu(false)}
            aria-label="Fechar menu"
          >
            <X />
          </button>
        </div>
        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={view === id ? 'active' : ''}
              onClick={() => {
                setView(id);
                setMenu(false);
              }}
            >
              <Icon />
              <span>{label}</span>
              {id === 'today' && <b>1</b>}
            </button>
          ))}
        </nav>
        <div className="priority-card">
          <span>FOCO DO CICLO</span>
          <strong>C · H · B</strong>
          <small>
            Atenção · Flexibilidade
            <br />
            Visuoespacial
          </small>
        </div>
        <button className="profile" onClick={() => setLogin(true)}>
          <span>AP</span>
          <div>
            <strong>
              {userEmail ? userEmail.split('@')[0] : 'Explorador'}
            </strong>
            <small>{userEmail ? 'Sincronizado' : 'Modo demonstração'}</small>
          </div>
          <Settings />
        </button>
      </aside>
      <section className="main-panel">
        <header className="topbar">
          <button
            className="icon-btn menu-btn"
            onClick={() => setMenu(true)}
            aria-label="Abrir menu"
          >
            <Menu />
          </button>
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="stats">
            <span>
              <Flame />
              <b>{data.streak}</b>
              <em>dias</em>
            </span>
            <span>
              <Trophy />
              <b>Nível {level}</b>
            </span>
            <div className="xp">
              <i style={{ width: `${(data.xp % 500) / 5}%` }} />
            </div>
            <small>{data.xp} XP</small>
          </div>
        </header>
        {content}
      </section>
      <nav className="bottom-nav">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={view === id ? 'active' : ''}
            onClick={() => setView(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {game && (
        <GameModal
          game={game}
          onClose={() => setGame(null)}
          onScore={(skill, score) => {
            setData((d) => ({
              ...d,
              xp: d.xp + 40,
              scores: {
                ...d.scores,
                [skill]: [...(d.scores[skill] || []), score],
              },
            }));
            setToast(`+40 XP · ${score}%`);
          }}
        />
      )}
      {login && (
        <LoginModal
          email={userEmail}
          onClose={() => setLogin(false)}
          onToast={setToast}
        />
      )}{' '}
      {toast && (
        <div className="toast">
          <Sparkles />
          {toast}
        </div>
      )}
    </main>
  );
}

function Today({
  week,
  day,
  setDay,
  completed,
  onPlay,
  onComplete,
}: {
  week: number;
  day: number;
  setDay: (d: number) => void;
  completed: string[];
  onPlay: (g: Game) => void;
  onComplete: () => void;
}) {
  const session = getSession(week, day),
    phase = getPhase(week),
    done = completed.includes(`w${week}d${day + 1}`),
    gameFor: Partial<Record<Skill, Game>> = {
      Atenção: 'attention',
      Flexibilidade: 'flexibility',
      Visuoespacial: 'spatial',
      Verbal: 'verbal',
    };
  return (
    <div className="page">
      <div className="eyebrow">
        SEMANA {week} DE 26 <span /> FASE {phase.name.toUpperCase()}
      </div>
      <div className="title-row">
        <div>
          <h1>Bom dia, explorador.</h1>
          <p>
            Sua missão de hoje equilibra precisão, mudança de regra e imaginação
            espacial.
          </p>
        </div>
        <div className="date-chip">
          <b>45</b>
          <span>MINUTOS</span>
        </div>
      </div>
      <div className="day-tabs">
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d, i) => (
          <button
            key={d}
            onClick={() => setDay(i)}
            className={day === i ? 'active' : ''}
          >
            <span>{d}</span>
            <b>{8 + i}</b>
            {completed.includes(`w${week}d${i + 1}`) && <i>✓</i>}
          </button>
        ))}
      </div>
      <section className="mission-card">
        <div className="mission-head">
          <div>
            <span className="live-dot" /> MISSÃO {day + 1}
          </div>
          <strong>{phase.detail}</strong>
        </div>
        <div className="activities">
          {session.map((a, i) => {
            const meta = skills.find((s) => s.name === a.skill)!;
            return (
              <article key={a.id}>
                <div className="activity-order">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="activity-main">
                  <div>
                    <span
                      className="skill-dot"
                      style={{ background: meta.color }}
                    />
                    <small>
                      {a.skill.toUpperCase()} · NÍVEL {a.level}
                    </small>
                    <h3>{a.title}</h3>
                  </div>
                  <div className="activity-actions">
                    <span>
                      <Timer />
                      {a.minutes} min
                    </span>
                    {gameFor[a.skill] && (
                      <button onClick={() => onPlay(gameFor[a.skill]!)}>
                        <Play />
                        JOGAR
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <button className="complete" onClick={onComplete} disabled={done}>
          {done ? 'MISSÃO CONCLUÍDA ✓' : 'CONCLUIR MISSÃO · +160 XP'}
          <ChevronRight />
        </button>
      </section>
      <aside className="note">
        <BrainCircuit />
        <div>
          <strong>Seu ponto de partida é um perfil de forças.</strong>
          <p>
            As prioridades C, H e B refletem discrepâncias relativas e seus
            objetivos — não “déficits”. O treino mede prática e desempenho nas
            tarefas, não QI.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Journey({
  week,
  setWeek,
  completed,
}: {
  week: number;
  setWeek: (w: number) => void;
  completed: string[];
}) {
  return (
    <div className="page">
      <div className="eyebrow">MAPA DA EXPEDIÇÃO</div>
      <div className="title-row">
        <div>
          <h1>26 semanas. Uma órbita completa.</h1>
          <p>
            Seis missões por semana, domingo de recuperação. A dificuldade sobe
            em seis fases.
          </p>
        </div>
      </div>
      <div className="phase-strip">
        {[1, 5, 10, 15, 21, 25].map((w, i) => (
          <div key={w} className={week >= w ? 'reached' : ''}>
            <span>{i + 1}</span>
            <b>{getPhase(w).name}</b>
            <small>{getPhase(w).range}</small>
          </div>
        ))}
      </div>
      <div className="week-grid">
        {Array.from({ length: 26 }, (_, i) => i + 1).map((w) => {
          const count = Array.from({ length: 6 }, (_, d) =>
            completed.includes(`w${w}d${d + 1}`),
          ).filter(Boolean).length;
          return (
            <button
              key={w}
              className={`${w === week ? 'selected' : ''} ${count === 6 ? 'complete-week' : ''}`}
              onClick={() => setWeek(w)}
            >
              <small>SEM</small>
              <b>{String(w).padStart(2, '0')}</b>
              <div>
                {Array.from({ length: 6 }, (_, d) => (
                  <i key={d} className={d < count ? 'done' : ''} />
                ))}
              </div>
              <span>{getPhase(w).name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Lab({ onPlay }: { onPlay: (g: Game) => void }) {
  const games: {
    id: Game;
    code: string;
    title: string;
    skill: string;
    desc: string;
    color: string;
  }[] = [
    {
      id: 'attention',
      code: 'C',
      title: 'Radar de Sinais',
      skill: 'Atenção concentrada',
      desc: 'Encontre o alvo entre distratores. Precisão, omissões e tempo de reação.',
      color: '#c8ff4d',
    },
    {
      id: 'flexibility',
      code: 'H',
      title: 'Troca de Comando',
      skill: 'Flexibilidade mental',
      desc: 'Mude a regra em movimento e reduza o custo cognitivo da alternância.',
      color: '#68e7ff',
    },
    {
      id: 'spatial',
      code: 'B',
      title: 'Giro Orbital',
      skill: 'Visualização espacial',
      desc: 'Reconheça figuras rotacionadas sem confundir com reflexos.',
      color: '#a88cff',
    },
    {
      id: 'verbal',
      code: 'V',
      title: 'Arena de Palavras',
      skill: 'Evocação e expressão verbal',
      desc: 'Defina, associe e use palavras em microficções científicas.',
      color: '#ffb454',
    },
  ];
  return (
    <div className="page">
      <div className="eyebrow">LABORATÓRIO</div>
      <div className="title-row">
        <div>
          <h1>Treine fora da rota.</h1>
          <p>
            Partidas curtas para praticar, recalibrar e melhorar seu recorde.
          </p>
        </div>
      </div>
      <div className="game-grid">
        {games.map((g) => (
          <article
            key={g.id}
            style={{ '--game': g.color } as React.CSSProperties}
          >
            <div className="game-code">{g.code}</div>
            <small>{g.skill}</small>
            <h2>{g.title}</h2>
            <p>{g.desc}</p>
            <div>
              <button onClick={() => onPlay(g.id)}>
                <Play /> JOGAR AGORA
              </button>
              <PromptButton text={gamePrompts[g.id]} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function PromptButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="prompt-btn"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1600);
      }}
    >
      <Copy />
      {ok ? 'COPIADO' : 'PROMPT HTML'}
    </button>
  );
}

function Progress({ data }: { data: Stored }) {
  return (
    <div className="page">
      <div className="eyebrow">TELEMETRIA PESSOAL</div>
      <div className="title-row">
        <div>
          <h1>Progresso que você pode observar.</h1>
          <p>
            Compare-se com sua própria linha de base. Consistência e tendência
            importam mais que um pico isolado.
          </p>
        </div>
      </div>
      <div className="metric-row">
        <Metric
          label="MISSÕES"
          value={String(data.completed.length)}
          note="de 156 no ciclo"
        />
        <Metric
          label="TEMPO DE VOO"
          value={`${Math.round((data.completed.length * 45) / 60)}h`}
          note="treino registrado"
        />
        <Metric
          label="SEQUÊNCIA"
          value={`${data.streak}d`}
          note="recorde atual"
        />
        <Metric
          label="XP TOTAL"
          value={String(data.xp)}
          note={`nível ${Math.floor(data.xp / 500) + 1}`}
        />
      </div>
      <section className="chart-card">
        <div>
          <h2>Métricas por habilidade</h2>
          <p>Índice interno de prática, não percentil clínico.</p>
        </div>
        {skills.slice(0, 4).map((s) => {
          const vals = data.scores[s.name] || [55],
            first = vals[0],
            last = vals.at(-1)!;
          return (
            <div className="skill-line" key={s.name}>
              <span style={{ color: s.color }}>{s.short}</span>
              <strong>
                {s.name}
                <small>{s.priority}</small>
              </strong>
              <div className="bar">
                <i style={{ width: `${last}%`, background: s.color }} />
              </div>
              <b>{last}</b>
              <em>
                {last - first >= 0 ? '+' : ''}
                {last - first}
              </em>
            </div>
          );
        })}
      </section>
      <section className="principles">
        <h2>Como ler seus dados</h2>
        <div>
          <article>
            <Target />
            <b>Meça o treinado</b>
            <p>
              Acurácia, tempo e consistência nos jogos; sem prometer
              transferência automática para índices clínicos.
            </p>
          </article>
          <article>
            <RotateCcw />
            <b>Recalibre a cada 4 semanas</b>
            <p>
              Repita uma versão-base descansado e observe a tendência, não uma
              sessão solta.
            </p>
          </article>
          <article>
            <BrainCircuit />
            <b>Preserve suas forças</b>
            <p>
              Velocidade, memória de trabalho e raciocínio forte continuam
              presentes nas missões integradas.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="metric">
      <small>{label}</small>
      <b>{value}</b>
      <span>{note}</span>
    </div>
  );
}

function GameModal({
  game,
  onClose,
  onScore,
}: {
  game: Game;
  onClose: () => void;
  onScore: (s: Skill, n: number) => void;
}) {
  const map = {
    attention: { title: 'Radar de Sinais', skill: 'Atenção' as Skill },
    flexibility: { title: 'Troca de Comando', skill: 'Flexibilidade' as Skill },
    spatial: { title: 'Giro Orbital', skill: 'Visuoespacial' as Skill },
    verbal: { title: 'Arena de Palavras', skill: 'Verbal' as Skill },
  };
  const [started, setStarted] = useState(false),
    [hits, setHits] = useState(0),
    [round, setRound] = useState(0),
    [rule, setRule] = useState(0),
    [verbal, setVerbal] = useState('');
  const target = (round * 7 + 14) % 16;
  const finish = (score: number) => {
    onScore(map[game].skill, score);
    onClose();
  };
  return (
    <dialog open className="modal-backdrop" aria-modal="true">
      <div className="game-modal">
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>
        <span className="modal-kicker">TREINO RÁPIDO · 2 MIN</span>
        <h2>{map[game].title}</h2>
        {!started ? (
          <div className="game-intro">
            <div className={`game-emblem ${game}`}>
              {game === 'attention'
                ? '◎'
                : game === 'flexibility'
                  ? '⇄'
                  : game === 'spatial'
                    ? '◇'
                    : 'Aa'}
            </div>
            <p>
              {game === 'attention'
                ? 'Toque apenas no sinal diferente.'
                : game === 'flexibility'
                  ? 'Siga a regra que muda a cada rodada.'
                  : game === 'spatial'
                    ? 'Escolha a orientação indicada.'
                    : 'Crie uma frase curta com a palavra sorteada.'}
            </p>
            <button onClick={() => setStarted(true)}>
              <Play /> INICIAR
            </button>
          </div>
        ) : (
          <div className="play-area">
            {game === 'attention' && (
              <>
                <p>Encontre o sinal com o ponto</p>
                <div className="signal-grid">
                  {Array.from({ length: 16 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i === target) setHits((h) => h + 1);
                        if (round >= 7)
                          finish(
                            Math.round(
                              ((hits + (i === target ? 1 : 0)) / 8) * 100,
                            ),
                          );
                        else setRound((r) => r + 1);
                      }}
                    >
                      {i === target ? '⊙' : '○'}
                    </button>
                  ))}
                </div>
                <b>
                  Rodada {round + 1}/8 · {hits} acertos
                </b>
              </>
            )}
            {game === 'flexibility' && (
              <>
                <p>
                  Regra: toque em{' '}
                  <strong>{rule % 2 === 0 ? 'PAR' : 'ÍMPAR'}</strong>
                </p>
                <div className="number-grid">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        const good = (n % 2 === 0) === (rule % 2 === 0),
                          nh = hits + (good ? 1 : 0);
                        if (round >= 7) finish(Math.round((nh / 8) * 100));
                        else {
                          setHits(nh);
                          setRound((r) => r + 1);
                          setRule((x) => x + 1);
                        }
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <b>
                  Trocas {round}/8 · {hits} acertos
                </b>
              </>
            )}
            {game === 'spatial' && (
              <>
                <p>
                  Gire mentalmente: onde aponta após {90 * ((round % 4) + 1)}°?
                </p>
                <div
                  className="rotation-display"
                  style={{ transform: `rotate(${90 * ((round % 4) + 1)}deg)` }}
                >
                  ➤
                </div>
                <div className="direction-row">
                  {['↑', '→', '↓', '←'].map((d, i) => (
                    <button
                      key={d}
                      onClick={() => {
                        const answer = ((round % 4) + 2) % 4,
                          nh = hits + (i === answer ? 1 : 0);
                        if (round >= 5) finish(Math.round((nh / 6) * 100));
                        else {
                          setHits(nh);
                          setRound((r) => r + 1);
                        }
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <b>
                  {round + 1}/6 · {hits} acertos
                </b>
              </>
            )}
            {game === 'verbal' && (
              <>
                <p>
                  Use{' '}
                  <strong>
                    {['órbita', 'paradoxo', 'horizonte', 'simbiose'][round % 4]}
                  </strong>{' '}
                  em uma frase de ficção científica.
                </p>
                <textarea
                  value={verbal}
                  onChange={(e) => setVerbal(e.target.value)}
                  placeholder="Escreva aqui…"
                />
                <button
                  className="submit-word"
                  disabled={verbal.trim().length < 12}
                  onClick={() => {
                    const nh = hits + (verbal.trim().length >= 24 ? 1 : 0);
                    if (round >= 3)
                      finish(Math.max(50, Math.round((nh / 4) * 100)));
                    else {
                      setHits(nh);
                      setRound((r) => r + 1);
                      setVerbal('');
                    }
                  }}
                >
                  ENVIAR FRASE
                </button>
                <b>{round + 1}/4 · autoavaliação por extensão</b>
              </>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}

function LoginModal({
  email,
  onClose,
  onToast,
}: {
  email: string | null;
  onClose: () => void;
  onToast: (s: string) => void;
}) {
  const [value, setValue] = useState(''),
    [password, setPassword] = useState(''),
    [mode, setMode] = useState<'in' | 'up'>('in'),
    [busy, setBusy] = useState(false);
  const submit = async () => {
    const s = getSupabase();
    if (!s) return onToast('Configure o Supabase para ativar o login');
    setBusy(true);
    const result =
      mode === 'up'
        ? await s.auth.signUp({ email: value, password })
        : await s.auth.signInWithPassword({ email: value, password });
    setBusy(false);
    if (result.error) return onToast(result.error.message);
    onToast(
      mode === 'up'
        ? 'Confira seu e-mail para confirmar'
        : 'Progresso sincronizado',
    );
    onClose();
  };
  const logout = async () => {
    await getSupabase()?.auth.signOut();
    onToast('Sessão encerrada');
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <div className="login-modal">
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>
        <Logo />
        <h2>{email ? 'Sua conta' : 'Sincronize sua jornada'}</h2>
        {email ? (
          <>
            <p>
              Conectado como <strong>{email}</strong>. Seus registros podem
              acompanhar você entre dispositivos.
            </p>
            <button className="danger" onClick={logout}>
              <LogOut /> SAIR
            </button>
          </>
        ) : (
          <>
            <p>
              {supabaseConfigured
                ? 'Entre para continuar no iPhone, iPad ou desktop.'
                : 'O modo demonstração está ativo. Adicione as variáveis do Supabase para habilitar contas e sincronização.'}
            </p>
            <label>
              E-mail
              <input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="voce@exemplo.com"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
              />
            </label>
            <button
              className="auth-submit"
              disabled={busy || !value || password.length < 6}
              onClick={submit}
            >
              {busy ? 'AGUARDE…' : mode === 'in' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
            <button
              className="text-btn"
              onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
            >
              {mode === 'in' ? 'Ainda não tenho conta' : 'Já tenho uma conta'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
