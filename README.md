# Órbita

Aplicativo responsivo para um ciclo de treino cognitivo de 26 semanas, com sessões de até 45 minutos, quatro minijogos e sincronização opcional via Supabase.

## Rodar localmente

1. Use Node.js 22 ou superior.
2. Copie `.env.example` para `.env.local` e preencha as duas variáveis do Supabase.
3. Execute `npm install` e `npm run dev`.

Sem variáveis do Supabase, o app entra em **modo demonstração** e guarda o progresso apenas neste navegador.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. No SQL Editor, execute `supabase/migrations/20260907000000_initial_schema.sql`.
3. Em Authentication, habilite Email e defina a URL do site e `http://localhost:3000` como URLs permitidas.
4. Copie a URL e a chave publicável para `.env.local`.

As três tabelas usam RLS: cada pessoa só acessa seus próprios registros. Nenhuma chave secreta é usada no cliente.

## Publicar na Vercel

Importe esta pasta como projeto, mantenha o preset Next.js e cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Depois acrescente a URL final da Vercel às URLs permitidas no Supabase Auth.

## Sobre o plano

O programa prioriza atenção/concentração (C), flexibilidade mental (H) e raciocínio visuoespacial (B). Linguagem, criatividade, desenho e programação preservam e transferem habilidades. Percentis não são tratados como diagnósticos ou déficits. O app acompanha desempenho em tarefas; não estima mudança de QI e não substitui acompanhamento profissional.
