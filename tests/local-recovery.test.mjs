import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLocalRecovery, recoverToAccount } from '../lib/local-recovery.ts';
const timestamp = '2026-09-15T15:00:00.000Z';
const log = {
  key: 's1-office-p1',
  date: '2026-09-15',
  week: 1,
  day: 2,
  domain: 'Verbal',
  minutes: 20,
  difficulty: 5,
  focus: 7,
  performance: 8,
  learned: 'Test learning',
  notes: 'Test notes',
  completedAt: timestamp,
  answers: ['A', 'B', 'C', 'D', 'E'],
  answerMode: 'online',
};
function storage(entries) {
  const keys = Object.keys(entries);
  return {
    length: keys.length,
    key: (i) => keys[i],
    getItem: (key) => entries[key] ?? null,
  };
}
function fakeClient({
  failDraft = false,
  missingConfirmation = false,
  user = 'owner',
} = {}) {
  const tables = {
    orbita_session_logs: new Map(),
    orbita_workbook_drafts: new Map(),
  };
  const client = {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: user } } },
        error: null,
      }),
    },
    from(table) {
      return {
        upsert(rows, options) {
          assert.equal(options.ignoreDuplicates, true);
          return {
            async select() {
              if (table === 'orbita_workbook_drafts' && failDraft)
                return { error: new Error('offline') };
              const data = [];
              for (const row of rows) {
                assert.equal(row.user_id, 'owner');
                if (!tables[table].has(row.session_key)) {
                  tables[table].set(row.session_key, structuredClone(row));
                  data.push({ session_key: row.session_key });
                }
              }
              return { data, error: null };
            },
          };
        },
        select() {
          return {
            eq(column, value) {
              assert.equal(column, 'user_id');
              assert.equal(value, 'owner');
              return {
                async in(column, keys) {
                  assert.equal(column, 'session_key');
                  return {
                    data: missingConfirmation
                      ? []
                      : keys
                          .filter((k) => tables[table].has(k))
                          .map((session_key) => ({ session_key })),
                    error: null,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
  return {
    client,
    tables,
    reconnect() {
      failDraft = false;
    },
  };
}
test('recovers completed session and latest anonymous draft, excluding other account caches', () => {
  const s = storage({
    'orbita-logs-v3': JSON.stringify([log]),
    'orbita-workbook-v1:local:s1-office-p1': JSON.stringify({
      answers: ['new'],
      mode: 'paper',
      updatedAt: '2026-09-15T16:00:00Z',
    }),
    'orbita-workbook-v1:someone:s1-office-p2': JSON.stringify({
      answers: ['private'],
      mode: 'online',
      updatedAt: timestamp,
    }),
  });
  const recovery = readLocalRecovery(s);
  assert.equal(recovery.logs.length, 1);
  assert.deepEqual(Object.keys(recovery.drafts), ['s1-office-p1']);
  assert.deepEqual(recovery.drafts[log.key].answers, ['new']);
  assert.ok(s.getItem('orbita-logs-v3'));
});
test('older draft does not replace answers from completion', () => {
  const r = readLocalRecovery(
    storage({
      'orbita-logs-v3': JSON.stringify([log]),
      'orbita-workbook-v1:local:s1-office-p1': JSON.stringify({
        answers: ['old'],
        mode: 'online',
        updatedAt: '2026-09-14T15:00:00Z',
      }),
    }),
  );
  assert.deepEqual(r.drafts[log.key].answers, log.answers);
});
test('recovers draft without requiring a completed session', () => {
  const r = readLocalRecovery(
    storage({
      'orbita-workbook-v1:local:s1-office-p2': JSON.stringify({
        answers: ['draft'],
        mode: 'online',
        updatedAt: timestamp,
      }),
    }),
  );
  assert.equal(r.logs.length, 0);
  assert.equal(Object.keys(r.drafts).length, 1);
});
test('malformed session history reports an error instead of silently omitting records', () => {
  assert.throws(() =>
    readLocalRecovery(storage({ 'orbita-logs-v3': 'broken' })),
  );
  assert.throws(() =>
    readLocalRecovery(
      storage({ 'orbita-logs-v3': JSON.stringify([{ key: 'bad' }]) }),
    ),
  );
});
test('uploads both records with original completion and answer content', async () => {
  const { client, tables } = fakeClient();
  const r = readLocalRecovery(
    storage({ 'orbita-logs-v3': JSON.stringify([log]) }),
  );
  assert.deepEqual(await recoverToAccount(client, 'owner', r), {
    inserted: 2,
    existing: 0,
  });
  assert.equal(tables.orbita_session_logs.get(log.key).completed_at, timestamp);
  assert.deepEqual(
    tables.orbita_workbook_drafts.get(log.key).answers,
    log.answers,
  );
});
test('retries after partial failure without duplicates or removing local source', async () => {
  const f = fakeClient({ failDraft: true });
  const s = storage({ 'orbita-logs-v3': JSON.stringify([log]) });
  const r = readLocalRecovery(s);
  await assert.rejects(recoverToAccount(f.client, 'owner', r));
  assert.equal(f.tables.orbita_session_logs.size, 1);
  assert.ok(s.getItem('orbita-logs-v3'));
  f.reconnect();
  assert.deepEqual(await recoverToAccount(f.client, 'owner', r), {
    inserted: 1,
    existing: 1,
  });
  assert.equal(f.tables.orbita_session_logs.size, 1);
  assert.equal(f.tables.orbita_workbook_drafts.size, 1);
});
test('existing cloud session and responses remain unchanged on repeat or conflicting import', async () => {
  const f = fakeClient();
  const r = readLocalRecovery(
    storage({ 'orbita-logs-v3': JSON.stringify([log]) }),
  );
  await recoverToAccount(f.client, 'owner', r);
  f.tables.orbita_session_logs.get(log.key).notes = 'Keep cloud';
  f.tables.orbita_workbook_drafts.get(log.key).answers = ['Cloud answer'];
  assert.deepEqual(await recoverToAccount(f.client, 'owner', r), {
    inserted: 0,
    existing: 2,
  });
  assert.equal(f.tables.orbita_session_logs.get(log.key).notes, 'Keep cloud');
  assert.deepEqual(f.tables.orbita_workbook_drafts.get(log.key).answers, [
    'Cloud answer',
  ]);
});
test('does not report success when read-back cannot confirm storage', async () => {
  const f = fakeClient({ missingConfirmation: true });
  await assert.rejects(
    recoverToAccount(
      f.client,
      'owner',
      readLocalRecovery(storage({ 'orbita-logs-v3': JSON.stringify([log]) })),
    ),
  );
});
test('account switch before transfer prevents all writes', async () => {
  const f = fakeClient({ user: 'different' });
  await assert.rejects(
    recoverToAccount(
      f.client,
      'owner',
      readLocalRecovery(storage({ 'orbita-logs-v3': JSON.stringify([log]) })),
    ),
  );
  assert.equal(f.tables.orbita_session_logs.size, 0);
});
