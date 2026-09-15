# Órbita

Treino cognitivo no escritório: 130 sessões de 20 minutos, de segunda a sexta-feira, a partir de 14/09/2026. Cada sessão tem cinco etapas, respondidas na plataforma ou feitas com papel e caneta e registradas em resumo.

## Uso

Abra https://project-orbita-omega.vercel.app/ e escolha Hoje. Os rascunhos são guardados automaticamente neste navegador. Para sincronizar respostas entre aparelhos, entre com sua conta e use Salvar respostas. Concluir sessão registra também as respostas no Diário. O histórico do calendário anterior continua disponível.

## Desenvolvimento

Node.js 22 ou superior. Execute `npm ci`, `npm run dev`, `npm run lint` e `npm run build`. As variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` substituem a configuração pública do projeto existente.

As migrações em `supabase/migrations` definem as tabelas. Rascunhos e sessões usam políticas RLS por usuário; nenhuma chave secreta deve ser incluída no cliente. O projeto tem integração GitHub/Vercel.

## Plano

Ênfase em evocação lexical, com memória operacional, raciocínio científico, funções executivas e exercícios visuoespaciais. As referências semanais devem ser abertas depois da tentativa. Sábados e domingos são de descanso. Pular um dia preserva a ordem das próximas missões. O app acompanha atividades, não fornece pontuação de QI.

## Recuperação de sessões feitas antes do login

Após entrar na conta, registros anônimos deste navegador aparecem em um aviso com a opção de enviá-los à conta. A transferência inclui sessões concluídas e respostas, confere a leitura no servidor e mantém a cópia original local. Registros já existentes na conta são preservados; uma nova tentativa após falha parcial não duplica sessões. Em outro dispositivo, entre com a mesma conta para carregar o progresso e o caderno.

Teste de regressão: `node --test tests/local-recovery.test.mjs` (Node 24).
