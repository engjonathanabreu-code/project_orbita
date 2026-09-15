import type { SupabaseClient } from '@supabase/supabase-js';

type LocalLog = {
  key: string;
  date: string;
  week: number;
  day: number;
  domain: string;
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
type Draft = { answers: string[]; mode: 'online' | 'paper'; updatedAt: string };
export type Recovery = { logs: LocalLog[]; drafts: Record<string, Draft> };
type BrowserStore = Pick<Storage, 'getItem' | 'key' | 'length'>;
const draftPrefix = 'orbita-workbook-v1:local:';
const validTime = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));
const validAnswers = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((answer) => typeof answer === 'string');

// Read only the pre-login scope. Other accounts' caches are never candidates.
export function readLocalRecovery(storage: BrowserStore): Recovery {
  const raw = storage.getItem('orbita-logs-v3');
  const parsed = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(parsed)) throw new Error('Histórico local inválido.');
  const logs: LocalLog[] = parsed.filter(
    (log) =>
      log &&
      typeof log.key === 'string' &&
      typeof log.date === 'string' &&
      typeof log.domain === 'string' &&
      validTime(log.completedAt) &&
      ['week', 'day', 'minutes', 'difficulty', 'focus', 'performance'].every(
        (field) => Number.isFinite(log[field]),
      ) &&
      typeof log.learned === 'string' &&
      typeof log.notes === 'string',
  );
  if (logs.length !== parsed.length)
    throw new Error('Histórico local inválido.');
  const drafts: Record<string, Draft> = Object.create(null);
  for (const log of logs) {
    if (validAnswers(log.answers))
      drafts[log.key] = {
        answers: log.answers,
        mode: log.answerMode === 'paper' ? 'paper' : 'online',
        updatedAt: log.completedAt,
      };
  }
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key?.startsWith(draftPrefix)) continue;
    const draft = JSON.parse(storage.getItem(key) || 'null');
    if (
      !draft ||
      !validAnswers(draft.answers) ||
      !validTime(draft.updatedAt) ||
      !['online', 'paper'].includes(draft.mode)
    )
      continue;
    const mission = key.slice(draftPrefix.length);
    if (!mission || !draft.answers.some((answer: string) => answer.trim()))
      continue;
    if (
      !drafts[mission] ||
      Date.parse(draft.updatedAt) > Date.parse(drafts[mission].updatedAt)
    )
      drafts[mission] = draft;
  }
  return {
    logs,
    drafts: Object.fromEntries(
      Object.entries(drafts).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
}

// Insert missing rows only: retries and simultaneous imports cannot overwrite
// a record already saved on another device. Keep the browser source intact.
export async function recoverToAccount(
  client: SupabaseClient,
  userId: string,
  recovery: Recovery,
) {
  const { data: sessionData, error: authError } =
    await client.auth.getSession();
  if (authError || sessionData.session?.user.id !== userId)
    throw new Error('Entre novamente na conta.');
  const logRows = recovery.logs.map((log) => ({
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
  }));
  const draftRows = Object.entries(recovery.drafts).map(([key, draft]) => ({
    user_id: userId,
    session_key: key,
    answers: draft.answers,
    answer_mode: draft.mode,
    updated_at: draft.updatedAt,
  }));
  let inserted = 0;
  let existing = 0;
  const batches: [
    string,
    { user_id: string; session_key: string; [field: string]: unknown }[],
  ][] = [
    ['orbita_session_logs', logRows],
    ['orbita_workbook_drafts', draftRows],
  ];
  for (const [table, rows] of batches) {
    if (!rows.length) continue;
    const { data, error } = await client
      .from(table)
      .upsert(rows, {
        onConflict: 'user_id,session_key',
        ignoreDuplicates: true,
      })
      .select('session_key');
    if (error) throw error;
    const { data: confirmed, error: readError } = await client
      .from(table)
      .select('session_key')
      .eq('user_id', userId)
      .in(
        'session_key',
        rows.map((row) => row.session_key),
      );
    if (readError) throw readError;
    const keys = new Set((confirmed || []).map((row) => row.session_key));
    if (rows.some((row) => !keys.has(row.session_key)))
      throw new Error('Envio ainda não confirmado.');
    inserted += data?.length || 0;
    existing += rows.length - (data?.length || 0);
  }
  return { inserted, existing };
}
