'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ClipboardList,
  Clock3,
  Gamepad2,
  Home,
  Menu,
  Settings2,
  Sparkles,
  Target,
  X,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import {
  domains,
  getPhase,
  getPrescription,
  seasonDistribution,
  seasonObjectives,
  type Domain,
} from '@/lib/plan';
import { getSupabase } from '@/lib/supabase';
import { getReference } from '@/lib/references';
import { Account } from '@/components/account';
import { Workbook, type WorkbookData } from '@/components/workbook';
import {
  START_DATE,
  dayLabels,
  localDate,
  isRest,
  slotKey,
  plannedCoords,
  coords,
  calendarDate,
  missionKey,
} from '@/lib/calendar';
type View = 'dashboard' | 'today' | 'season' | 'progress' | 'journal';
type Log = {
  key: string;
  date: string;
  week: number;
  day: number;
  domain: Domain;
  minutes: number;
  difficulty: number;
  focus: number;
  performance: number;
  learned: string;
  notes: string;
  completedAt: string;
  answers?: string[];
  answerMode?: 'online' | 'paper';
};
const nav = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'today', label: 'Hoje', icon: Target },
  { id: 'season', label: 'Temporada', icon: CalendarDays },
  { id: 'progress', label: 'Evolução', icon: BarChart3 },
  { id: 'journal', label: 'Diário', icon: BookOpen },
] as const;
export default function HomePage() {
  const c = coords();
  const [view, setView] = useState<View>('dashboard');
  const [week, setWeek] = useState(c.week);
  const [day, setDay] = useState(c.day);
  const [logs, setLogs] = useState<Log[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [menu, setMenu] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loadedScope, setLoadedScope] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const handleUser = useCallback((id: string | null) => setUserId(id), []);
  useEffect(() => {
    let alive = true;
    void getSupabase()
      .auth.getSession()
      .then(() => {
        if (!alive) return;
        let local: Log[] = [];
        try {
          const raw = localStorage.getItem(
            userId ? `orbita-logs-v4:${userId}` : 'orbita-logs-v3',
          );
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) local = parsed;
          }
          const sk = localStorage.getItem('orbita-skipped-office-v1');
          if (sk) {
            const parsed = JSON.parse(sk);
            if (Array.isArray(parsed)) setSkipped(parsed);
          }
        } catch {
          setSaveMessage('Não foi possível ler parte do histórico local.');
        }
        setLogs(local);
        setLoadedScope(userId || 'local');
        setReady(true);
        if (userId)
          void getSupabase()
            .from('orbita_session_logs')
            .select('*')
            .eq('user_id', userId)
            .then(({ data, error }) => {
              if (!alive) return;
              if (error) {
                setSaveMessage(
                  'Não foi possível carregar o histórico online. Seus registros locais foram preservados.',
                );
                return;
              }
              const remote: Log[] = (data || []).map((r) => ({
                key: r.session_key,
                date: r.session_date,
                week: r.week_number,
                day: r.day_number,
                domain: r.domain,
                minutes: r.minutes,
                difficulty: r.difficulty,
                focus: r.focus,
                performance: r.performance,
                learned: r.learned || '',
                notes: r.notes || '',
                completedAt: r.completed_at,
              }));
              setLogs((current) => {
                const merged = new Map(remote.map((r) => [r.key, r]));
                for (const r of current) {
                  const existing = merged.get(r.key);
                  if (!existing || r.completedAt > existing.completedAt)
                    merged.set(r.key, r);
                }
                return [...merged.values()].sort((a, b) =>
                  b.completedAt.localeCompare(a.completedAt),
                );
              });
            });
      });
    return () => {
      alive = false;
    };
  }, [userId]);
  useEffect(() => {
    if (!ready || loadedScope !== (userId || 'local')) return;
    try {
      localStorage.setItem(
        userId ? `orbita-logs-v4:${userId}` : 'orbita-logs-v3',
        JSON.stringify(logs),
      );
    } catch {
      console.warn('Não foi possível salvar o histórico neste navegador.');
    }
  }, [logs, ready, userId, loadedScope]);
  useEffect(() => {
    if (ready)
      localStorage.setItem('orbita-skipped-office-v1', JSON.stringify(skipped));
  }, [skipped, ready]);
  const save = async (log: Log) => {
    const next = [log, ...logs.filter((x) => x.key !== log.key)];
    setLogs(next);
    try {
      localStorage.setItem(
        userId ? `orbita-logs-v4:${userId}` : 'orbita-logs-v3',
        JSON.stringify(next),
      );
      setSaveMessage('Sessão salva neste navegador.');
    } catch {
      setSaveMessage(
        'Não foi possível salvar neste navegador. Mantenha esta página aberta.',
      );
    }
    if (!userId) return;
    try {
      const s = getSupabase();
      const { error } = await s.from('orbita_session_logs').upsert(
        {
          user_id: userId,
          session_key: log.key,
          session_date: log.date,
          week_number: log.week,
          day_number: log.day,
          domain: log.domain,
          minutes: log.minutes,
          difficulty: log.difficulty,
          focus: log.focus,
          performance: log.performance,
          learned: log.learned,
          notes: log.notes,
          completed_at: log.completedAt,
        },
        { onConflict: 'user_id,session_key' },
      );
      if (error) throw error;
      const { error: draftError } = await s
        .from('orbita_workbook_drafts')
        .upsert(
          {
            user_id: userId,
            session_key: log.key,
            answers: log.answers || [],
            answer_mode: log.answerMode || 'online',
            updated_at: log.completedAt,
          },
          { onConflict: 'user_id,session_key' },
        );
      if (draftError) throw draftError;
      setSaveMessage('Sessão e respostas salvas na sua conta.');
    } catch {
      setSaveMessage(
        'Sessão salva localmente, mas o envio online falhou. Abra o registro e salve novamente para tentar.',
      );
    }
  };
  const toggleSkip = (w: number, d: number) => {
    const k = slotKey(w, d);
    setSkipped((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  };
  const currentLogs = logs.filter((l) => l.key.startsWith('s1-office-p'));
  const completed = new Set(currentLogs.map((l) => l.key));
  return (
    <main className="shell">
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <div className="brandRow">
          <div className="brand">
            <span className="orbitMark">◎</span> ÓRBITA
          </div>
          <button className="icon mobileOnly" onClick={() => setMenu(false)}>
            <X />
          </button>
        </div>
        <p className="seasonTag">TEMPORADA 1 · 20 MIN/DIA</p>
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
            </button>
          ))}
        </nav>
        <div className="sideCard">
          <span>PRINCÍPIO</span>
          <strong>Treinar a habilidade, não o exercício.</strong>
          <p>
            Missões de 20 minutos no escritório: responda aqui ou use papel e
            caneta. Se um dia for pulado, a sequência é deslocada
            automaticamente.
          </p>
        </div>
        <div className="sideFooter">
          <Settings2 />
          130 sessões · segunda a sexta
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <button className="icon mobileOnly" onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <div>
            <small>PROGRAMA COGNITIVO LONGITUDINAL</small>
            <strong>
              20 min · evocação lexical prioritária · progressão e transferência
            </strong>
          </div>
          <div className="topStat">
            <CheckCircle2 />
            {currentLogs.length}/130 concluídas
          </div>
        </header>
        <div className="accountWrap">
          <Account onUser={handleUser} />
          {saveMessage && <output>{saveMessage}</output>}
        </div>
        {view === 'dashboard' && (
          <Dashboard
            logs={currentLogs}
            skipped={skipped}
            goToday={() => setView('today')}
          />
        )}{' '}
        {view === 'today' &&
          (day === 0 ? (
            <div className="page">
              <div className="eyebrow">TEMPORADA 1 · INÍCIO 14/09/2026</div>
              <div className="empty">
                <Clock3 />
                <h3>A temporada começa amanhã</h3>
                <p>A Missão 1 estará disponível em 14/09/2026.</p>
              </div>
            </div>
          ) : (
            <Today
              key={`${userId || 'local'}-${week}-${day}-${skipped.join(',')}-${logs.map((l) => l.completedAt).join(',')}`}
              userId={userId}
              week={week}
              day={day}
              setDay={setDay}
              logs={logs}
              skipped={skipped}
              onSave={save}
              onSkip={() => toggleSkip(week, day)}
            />
          ))}{' '}
        {view === 'season' && (
          <Season
            week={week}
            setWeek={(w) => {
              setWeek(w);
              setDay(1);
              setView('today');
            }}
            completed={completed}
            skipped={skipped}
          />
        )}{' '}
        {view === 'progress' && <Progress logs={currentLogs} />}{' '}
        {view === 'journal' && <Journal logs={logs} />}
      </section>
    </main>
  );
}
function Dashboard({
  logs,
  skipped,
  goToday,
}: {
  logs: Log[];
  skipped: string[];
  goToday: () => void;
}) {
  const dist = seasonDistribution();
  const doneBy = Object.fromEntries(
    domains.map((d) => [
      d,
      logs.filter(
        (l) =>
          l.domain === d ||
          getPrescription(l.week, l.day).secondaryDomain === d,
      ).length,
    ]),
  ) as Record<Domain, number>;
  return (
    <div className="page">
      <div className="eyebrow">
        TEMPORADA 1 · INÍCIO 14/09/2026 · 26 SEMANAS
      </div>
      <div className="hero">
        <div>
          <h1>Objetivos da temporada</h1>
          <p>
            Construir evolução mensurável em capacidades específicas com sessões
            de baixa fricção, conteúdo pronto e transferência para problemas
            novos.
          </p>
        </div>
        <button className="primary" onClick={goToday}>
          VER TREINO ATUAL
          <ChevronRight />
        </button>
      </div>
      <div className="instructionGrid">
        <div className="mainInstruction">
          <h3>
            <Target />
            Principais objetivos
          </h3>
          {seasonObjectives.map((o, i) => (
            <div className="step" key={o}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <p>{o}</p>
            </div>
          ))}
        </div>
        <aside className="rules">
          <h3>
            <CircleGauge />
            Resumo da temporada
          </h3>
          <p>
            <strong>130</strong> sessões planejadas
          </p>
          <p>
            <strong>{logs.length}</strong> concluídas
          </p>
          <p>
            <strong>{skipped.length}</strong> dias pulados e remanejados
          </p>
          <p>
            <strong>20 min</strong> por sessão
          </p>
          <p>
            <strong>Sábado e domingo</strong> descanso
          </p>
          <p>
            <strong>No escritório</strong> respostas online ou papel e caneta
          </p>
        </aside>
      </div>
      <div className="eyebrow" style={{ marginTop: 28 }}>
        DISTRIBUIÇÃO DAS HABILIDADES · UMA SESSÃO PODE TREINAR MAIS DE UMA
      </div>
      <div className="domainGrid">
        {domains.map((d) => (
          <article key={d}>
            <span>{d}</span>
            <b>{dist[d]}</b>
            <small>sessões que treinam a habilidade</small>
            <div>
              <em>{doneBy[d]} concluídas</em>
              <em>{Math.max(0, dist[d] - doneBy[d])} restantes</em>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function Today({
  week,
  day,
  setDay,
  logs,
  skipped,
  onSave,
  onSkip,
  userId,
}: {
  week: number;
  day: number;
  setDay: (d: number) => void;
  logs: Log[];
  skipped: string[];
  onSave: (l: Log) => void;
  onSkip: () => void;
  userId: string | null;
}) {
  const [workbook, setWorkbook] = useState<WorkbookData>({
    answers: Array(5).fill(''),
    mode: 'online',
    updatedAt: '',
  });
  const rest = isRest(day),
    calendarKey = slotKey(week, day),
    wasSkipped = skipped.includes(calendarKey),
    plan = plannedCoords(week, day, skipped),
    phase = plan ? getPhase(plan.week) : getPhase(26),
    p = plan && !wasSkipped ? getPrescription(plan.week, plan.day) : null,
    key = plan ? missionKey(plan.ordinal) : calendarKey,
    existing = logs.find((l) => l.key === key);
  const [open, setOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(existing?.difficulty ?? 5);
  const [focus, setFocus] = useState(existing?.focus ?? 5);
  const [performance, setPerformance] = useState(existing?.performance ?? 5);
  const [minutes, setMinutes] = useState(existing?.minutes ?? p?.minutes ?? 0);
  const [learned, setLearned] = useState(existing?.learned ?? '');
  const [notes, setNotes] = useState(
    (existing?.notes ?? '').split('\n\nRespostas (')[0],
  );
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        calendarDate(week, i + 1).getUTCDate(),
      ),
    [week],
  );
  return (
    <div className="page">
      <div className="eyebrow">
        SEMANA DE CALENDÁRIO {week}
        {plan
          ? ` · MISSÃO ${plan.ordinal}/130 · ${phase.name.toUpperCase()}`
          : ''}
      </div>
      <div className="hero">
        <div>
          <h1>
            {rest
              ? 'Dia de descanso'
              : wasSkipped
                ? 'Dia pulado'
                : p
                  ? 'Manual do dia'
                  : 'Temporada concluída'}
          </h1>
          <p>
            {rest
              ? 'Sábado e domingo são reservados para descanso.'
              : wasSkipped
                ? 'Esta missão foi deslocada automaticamente para o próximo dia disponível.'
                : p
                  ? phase.detail
                  : 'As 130 sessões planejadas foram concluídas ou já foram alocadas.'}
          </p>
        </div>
        {p && (
          <div className="timePill">
            <Clock3 />
            <b>{p.minutes}</b>
            <span>min</span>
          </div>
        )}
      </div>
      {localDate() < START_DATE && (
        <p className="startNotice">
          A temporada começa segunda-feira, 14/09/2026. Você já pode conhecer e
          preparar as tarefas.
        </p>
      )}
      <div className="dayTabs">
        {dayLabels.map((label, i) => (
          <button
            key={label}
            className={day === i + 1 ? 'active' : ''}
            onClick={() => setDay(i + 1)}
          >
            <span>{label}</span>
            <b>{dates[i]}</b>
            {isRest(i + 1) ? (
              <i>—</i>
            ) : skipped.includes(slotKey(week, i + 1)) ? (
              <i>↷</i>
            ) : null}
          </button>
        ))}
      </div>
      {rest ? (
        <div className="empty">
          <Clock3 />
          <h3>Descanso programado</h3>
          <p>
            A próxima missão fica para segunda-feira. Você pode consultar o
            material da semana a qualquer momento.
          </p>
        </div>
      ) : wasSkipped ? (
        <div className="empty">
          <SkipForward />
          <h3>Treino remanejado</h3>
          <p>
            O sistema preservou a missão e deslocou toda a sequência seguinte
            para o próximo dia disponível.
          </p>
          <button className="primary" onClick={onSkip}>
            <RotateCcw />
            DESFAZER PULO
          </button>
        </div>
      ) : p && plan ? (
        <section className="prescription">
          <div className="prescriptionTop">
            <div>
              <span className="domain">
                <Target />
                {p.domain}
              </span>
              <h2>{p.title}</h2>
              <p>{p.subtitle}</p>
            </div>
            <div className="level">
              <CircleGauge />
              <span>Nível</span>
              <b>{p.level}</b>
            </div>
          </div>
          <div className="instructionGrid">
            <div className="mainInstruction">
              <h3>
                <ClipboardList />
                Como realizar
              </h3>
              <p>
                Use os campos abaixo durante a atividade. Cada etapa leva
                aproximadamente quatro minutos.
              </p>
              <p>
                Se preferir papel e caneta, selecione “Fazer no papel” e
                registre o resultado de cada etapa.
              </p>
            </div>
            <aside className="rules">
              <h3>
                <BrainCircuit />
                Regra cognitiva
              </h3>
              <p>{p.rule}</p>
              <h3>
                <Gamepad2 />
                Material
              </h3>
              <p>{p.environment}</p>
              <h3>
                <Sparkles />O que registrar
              </h3>
              <p>{p.record}</p>
            </aside>
          </div>
          <details className="stimulus">
            <summary>Referência da semana · abrir depois da tentativa</summary>
            <p>{getReference(plan.week)}</p>
            <p>
              Para aprofundar:{' '}
              <a href="https://openstax.org/" target="_blank" rel="noreferrer">
                OpenStax
              </a>{' '}
              ·{' '}
              <a
                href="https://science.nasa.gov/"
                target="_blank"
                rel="noreferrer"
              >
                NASA Science
              </a>
              .
            </p>
          </details>
          <Workbook
            key={`${key}-${userId || 'local'}`}
            mission={key}
            userId={userId}
            p={p}
            onChange={setWorkbook}
          />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="primary" onClick={() => setOpen(!open)}>
              {existing
                ? 'VER / EDITAR REGISTRO'
                : 'CONCLUIR / REGISTRAR RESULTADO'}
              <ChevronRight />
            </button>
            {!existing && (
              <button className="primary" onClick={onSkip}>
                <SkipForward />
                PULAR ESTE DIA
              </button>
            )}
          </div>
          {open && (
            <div className="logForm">
              <Metric
                label="Dificuldade percebida"
                value={difficulty}
                setValue={setDifficulty}
              />
              <Metric label="Concentração" value={focus} setValue={setFocus} />
              <Metric
                label="Desempenho percebido"
                value={performance}
                setValue={setPerformance}
              />
              <label>
                Tempo realizado (min)
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                />
              </label>
              <label className="wide">
                O que aprendi hoje
                <textarea
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  placeholder="Escreva com suas palavras."
                />
              </label>
              <label className="wide">
                Observações / resultado objetivo
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Erros, acertos, resultado, estratégia, palavras evocadas..."
                />
              </label>
              <button
                className="save"
                onClick={() => {
                  onSave({
                    key,
                    date: localDate(),
                    week: plan.week,
                    day: plan.day,
                    domain: p.domain,
                    minutes,
                    difficulty,
                    focus,
                    performance,
                    learned,
                    notes: [
                      notes,
                      `Respostas (${workbook.mode === 'paper' ? 'papel' : 'online'}):`,
                      ...workbook.answers.map((a, i) => `Etapa ${i + 1}: ${a}`),
                    ].join('\n\n'),
                    answers: workbook.answers,
                    answerMode: workbook.mode,
                    completedAt: new Date().toISOString(),
                  });
                  setOpen(false);
                }}
              >
                <CheckCircle2 />
                Salvar sessão
              </button>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
function Metric({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <label>
      {label}
      <div className="scale">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            type="button"
            key={n}
            className={value === n ? 'selected' : ''}
            onClick={() => setValue(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </label>
  );
}
function Season({
  week,
  setWeek,
  completed,
  skipped,
}: {
  week: number;
  setWeek: (w: number) => void;
  completed: Set<string>;
  skipped: string[];
}) {
  const weeks = 26 + Math.ceil(skipped.length / 5);
  return (
    <div className="page">
      <div className="eyebrow">
        TEMPORADA 1 · 130 SESSÕES · {skipped.length} REMANEJAMENTOS
      </div>
      <div className="hero">
        <div>
          <h1>Mapa da temporada</h1>
          <p>
            O calendário pode se estender quando dias são pulados. Nenhuma das
            130 missões é descartada.
          </p>
        </div>
      </div>
      <div className="phases">
        {[1, 3, 7, 13, 19, 24, 26].map((w) => (
          <div key={w}>
            <b>{getPhase(w).name}</b>
            <span>{getPhase(w).range}</span>
          </div>
        ))}
      </div>
      <div className="weekGrid">
        {Array.from({ length: weeks }, (_, i) => i + 1).map((w) => {
          let count = 0;
          for (let d = 1; d <= 7; d++) {
            const pc = plannedCoords(w, d, skipped);
            if (pc && completed.has(missionKey(pc.ordinal))) count++;
          }
          return (
            <button
              key={w}
              className={w === week ? 'selected' : ''}
              onClick={() => setWeek(w)}
            >
              <small>CALENDÁRIO</small>
              <b>{String(w).padStart(2, '0')}</b>
              <span>{w <= 26 ? getPhase(w).name : 'Extensão'}</span>
              <div className="dots">
                {Array.from({ length: 5 }, (_, d) => (
                  <i key={d} className={d < count ? 'done' : ''} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function Progress({ logs }: { logs: Log[] }) {
  const avg = (xs: number[]) =>
    xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  return (
    <div className="page">
      <div className="eyebrow">EVOLUÇÃO LONGITUDINAL</div>
      <div className="hero">
        <div>
          <h1>Seu desenvolvimento</h1>
          <p>
            O Órbita acompanha desempenho nas atividades e transferência. Ele
            não converte prática diária em “pontos de QI”.
          </p>
        </div>
      </div>
      {logs.length === 0 ? (
        <Empty text="Ainda não há resultados. As novas sessões começam em 14/09/2026; registros anteriores continuam no Diário." />
      ) : (
        <div className="domainGrid">
          {domains.map((d) => {
            const rows = logs.filter(
              (l) =>
                l.domain === d ||
                getPrescription(l.week, l.day).secondaryDomain === d,
            );
            return (
              <article key={d}>
                <span>{d}</span>
                <b>{rows.length}</b>
                <small>sessões</small>
                <div>
                  <em>Foco {avg(rows.map((r) => r.focus)).toFixed(1)}</em>
                  <em>
                    Desempenho {avg(rows.map((r) => r.performance)).toFixed(1)}
                  </em>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
function Journal({ logs }: { logs: Log[] }) {
  return (
    <div className="page">
      <div className="eyebrow">DIÁRIO ÓRBITA</div>
      <div className="hero">
        <div>
          <h1>Histórico de sessões</h1>
          <p>
            Registro do que você fez, percebeu e aprendeu ao longo da temporada.
          </p>
        </div>
      </div>
      {logs.length === 0 ? (
        <Empty text="Nenhuma sessão registrada ainda." />
      ) : (
        <div className="journal">
          {logs.map((l) => (
            <article key={l.key}>
              <div>
                <small>
                  SEM {l.week} · MISSÃO{' '}
                  {l.key.replace('s1-office-p', '').replace('s1-p', '')}
                </small>
                <b>{l.domain}</b>
                <span>{l.date}</span>
              </div>
              <div className="chips">
                <span>Foco {l.focus}/10</span>
                <span>Dificuldade {l.difficulty}/10</span>
                <span>{l.minutes} min</span>
              </div>
              {l.learned && (
                <p>
                  <strong>Aprendi:</strong> {l.learned}
                </p>
              )}
              {l.notes && <p>{l.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <BrainCircuit />
      <h3>Sem dados ainda</h3>
      <p>{text}</p>
    </div>
  );
}
