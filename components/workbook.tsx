'use client';
import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Prescription } from '@/lib/plan';
export type WorkbookData = {
  answers: string[];
  mode: 'online' | 'paper';
  updatedAt: string;
};
const empty = (): WorkbookData => ({
  answers: Array(5).fill(''),
  mode: 'online',
  updatedAt: '',
});
export function Workbook({
  mission,
  userId,
  p,
  onChange,
}: {
  mission: string;
  userId: string | null;
  p: Prescription;
  onChange: (data: WorkbookData) => void;
}) {
  const [data, setData] = useState<WorkbookData>(empty),
    [loaded, setLoaded] = useState(false),
    [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false),
    [remote, setRemote] = useState<WorkbookData | null>(null);
  const dirty = useRef(false);
  const storageKey = `orbita-workbook-v1:${userId || 'local'}:${mission}`;
  useEffect(() => {
    let alive = true;
    void getSupabase()
      .auth.getSession()
      .then(() => {
        if (!alive) return;
        dirty.current = false;
        setRemote(null);
        let local = empty();
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.answers)) local = parsed;
          }
        } catch {
          setStatus('Não foi possível ler o rascunho local.');
        }
        setData(local);
        onChange(local);
        setLoaded(true);
        setStatus(
          local.updatedAt
            ? 'Rascunho recuperado deste navegador.'
            : 'Preencha aqui ou faça no papel e registre um resumo.',
        );
        if (userId)
          void getSupabase()
            .from('orbita_workbook_drafts')
            .select('answers,answer_mode,updated_at')
            .eq('user_id', userId)
            .eq('session_key', mission)
            .maybeSingle()
            .then(({ data: row, error }) => {
              if (!alive) return;
              if (error) {
                setStatus(
                  'Não foi possível carregar a conta. O rascunho local está disponível.',
                );
                return;
              }
              if (row && Array.isArray(row.answers)) {
                const next = {
                  answers: row.answers as string[],
                  mode: row.answer_mode as 'online' | 'paper',
                  updatedAt: row.updated_at,
                };
                if (dirty.current) {
                  setRemote(next);
                  setStatus(
                    'Há uma versão online. Seu texto atual foi preservado.',
                  );
                } else if (
                  !local.updatedAt ||
                  next.updatedAt > local.updatedAt
                ) {
                  setData(next);
                  onChange(next);
                  setStatus('Respostas recuperadas da sua conta.');
                } else
                  setStatus(
                    'Rascunho local recuperado. Use Salvar respostas para enviar à conta.',
                  );
              }
            });
      });
    return () => {
      alive = false;
    };
  }, [storageKey, userId, mission, onChange]);
  function change(next: WorkbookData) {
    dirty.current = true;
    next.updatedAt = new Date().toISOString();
    setData(next);
    onChange(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStatus('Rascunho guardado neste navegador.');
    } catch {
      setStatus(
        'Não foi possível salvar neste navegador. Copie suas respostas antes de sair.',
      );
    }
  }
  async function save() {
    setBusy(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (userId) {
        const { error } = await getSupabase()
          .from('orbita_workbook_drafts')
          .upsert(
            {
              user_id: userId,
              session_key: mission,
              answers: data.answers,
              answer_mode: data.mode,
              updated_at: data.updatedAt || new Date().toISOString(),
            },
            { onConflict: 'user_id,session_key' },
          );
        if (error) throw error;
        setStatus('Respostas salvas na sua conta.');
      } else
        setStatus(
          'Respostas salvas neste navegador. Entre na conta para salvar online.',
        );
    } catch {
      setStatus(
        'Não foi possível confirmar o salvamento. Suas respostas continuam nos campos; tente novamente.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="workbook">
      <h3>Meu caderno de atividades</h3>
      <p>
        Cinco etapas de quatro minutos. Você pode pausar e continuar depois.
      </p>
      <div className="answerModes">
        <button
          type="button"
          aria-pressed={data.mode === 'online'}
          onClick={() => change({ ...data, mode: 'online' })}
        >
          Responder aqui
        </button>
        <button
          type="button"
          aria-pressed={data.mode === 'paper'}
          onClick={() => change({ ...data, mode: 'paper' })}
        >
          Fazer no papel
        </button>
      </div>
      {p.stimulus && (
        <details className="stimulus">
          <summary>Mostrar / ocultar material de consulta</summary>
          <p>{p.stimulus}</p>
        </details>
      )}
      {p.steps.map((step, i) => (
        <article className="answerStep" key={i}>
          <h4>Etapa {i + 1}</h4>
          <p>{step}</p>
          <label htmlFor={`answer-${i}`}>
            {data.mode === 'paper'
              ? 'Resumo do que fiz no papel'
              : p.prompts?.[i] || 'Minha resposta'}
          </label>
          <textarea
            id={`answer-${i}`}
            rows={4}
            maxLength={12000}
            disabled={!loaded}
            value={data.answers[i] || ''}
            onChange={(e) => {
              const answers = [...data.answers];
              answers[i] = e.target.value;
              change({ ...data, answers });
            }}
            placeholder={
              data.mode === 'paper'
                ? 'Registre o resultado ou descreva seu desenho.'
                : 'Escreva com suas palavras…'
            }
          />
        </article>
      ))}
      <div className="workbookActions">
        <button
          type="button"
          className="primary"
          disabled={busy || !loaded}
          onClick={() => void save()}
        >
          {busy ? 'Salvando…' : 'SALVAR RESPOSTAS'}
        </button>
        <output>{status}</output>
      </div>
      {remote && (
        <details>
          <summary>Ver versão online recuperada</summary>
          {remote.answers.map((a, i) => (
            <p key={i}>
              <strong>Etapa {i + 1}:</strong> {a}
            </p>
          ))}
        </details>
      )}
    </section>
  );
}
