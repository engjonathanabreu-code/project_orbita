'use client';
import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import {
  readLocalRecovery,
  recoverToAccount,
  type Recovery,
} from '@/lib/local-recovery';

export function LocalRecovery({
  userId,
  onRecovered,
}: {
  userId: string;
  onRecovered: () => void;
}) {
  const [recovery, setRecovery] = useState<Recovery | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);
  const pending = useRef(false);
  const marker = `orbita-local-recovery-v1:${userId}`;
  useEffect(() => {
    alive.current = true;
    void getSupabase()
      .auth.getSession()
      .then(({ data, error }) => {
        if (!alive.current || error || data.session?.user.id !== userId) return;
        const local = readLocalRecovery(localStorage);
        if (localStorage.getItem(marker) !== JSON.stringify(local))
          setRecovery(local);
      })
      .catch(() => {
        if (alive.current)
          setMessage(
            'Não foi possível ler os registros deste navegador. Eles foram preservados.',
          );
      });
    return () => {
      alive.current = false;
    };
  }, [marker, userId]);

  async function recover() {
    if (!recovery || pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage('Enviando e conferindo os registros na sua conta…');
    try {
      const result = await recoverToAccount(getSupabase(), userId, recovery);
      try {
        localStorage.setItem(marker, JSON.stringify(recovery));
      } catch {
        /* Source remains available. */
      }
      if (!alive.current) return;
      setRecovery(null);
      setMessage(
        `Transferência conferida na nuvem. ${result.existing ? 'Registros que já existiam na conta foram mantidos. ' : ''}A cópia original continua neste navegador.`,
      );
      onRecovered();
    } catch {
      if (alive.current)
        setMessage(
          'O envio não foi concluído. Seus registros continuam neste navegador. Tente novamente; os itens já enviados não serão duplicados.',
        );
    } finally {
      pending.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const hasRecords =
    recovery &&
    (recovery.logs.length > 0 || Object.keys(recovery.drafts).length > 0);
  if (!hasRecords && !message) return null;
  return (
    <section
      className="localRecovery"
      aria-label="Recuperar registros deste navegador"
    >
      {hasRecords && (
        <>
          <strong>Você tem registros feitos antes de entrar na conta.</strong>
          <p>
            {recovery.logs.length} sessão(ões) e{' '}
            {Object.keys(recovery.drafts).length} conjunto(s) de respostas neste
            navegador. Envie os seus registros para acessá-los em outros
            dispositivos com esta conta.
          </p>
          <p>
            Se uma missão já estiver na conta, a versão da conta será mantida.
          </p>
          <button className="primary" disabled={busy} onClick={recover}>
            {busy
              ? 'ENVIANDO…'
              : 'ENVIAR REGISTROS DESTE NAVEGADOR PARA MINHA CONTA'}
          </button>
        </>
      )}
      {message && <output>{message}</output>}
    </section>
  );
}
