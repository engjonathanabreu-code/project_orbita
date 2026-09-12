'use client';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
export function Account({ onUser }: { onUser: (id: string | null) => void }) {
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [current, setCurrent] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const s = getSupabase();
    let alive = true;
    void s.auth.getSession().then(({ data }) => {
      if (alive) {
        setCurrent(data.session?.user.email || '');
        onUser(data.session?.user.id || null);
      }
    });
    const { data } = s.auth.onAuthStateChange((_event, session) => {
      if (alive) {
        setCurrent(session?.user.email || '');
        onUser(session?.user.id || null);
      }
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [onUser]);
  async function login() {
    setBusy(true);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });
      setMessage(
        error
          ? 'Não foi possível entrar. Confira e-mail e senha.'
          : 'Conta conectada.',
      );
      if (!error) setPassword('');
    } catch {
      setMessage('Sem conexão. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="account">
      <summary>
        {current ? 'Conta conectada' : 'Salvar também na minha conta'}
      </summary>
      {current ? (
        <>
          <p>{current}</p>
          <button
            type="button"
            onClick={async () => {
              const { error } = await getSupabase().auth.signOut();
              if (error) setMessage('Não foi possível sair. Tente novamente.');
            }}
          >
            Sair da conta
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void login();
          }}
        >
          <p>
            Entre com sua conta para guardar respostas e resultados online. Sem
            entrar, seus rascunhos ficam neste navegador.
          </p>
          <label>
            E-mail
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      )}
      {message && <output>{message}</output>}
    </details>
  );
}
