# Operação da pousada

## Primeiro acesso local

Requer Node.js 22.12+ e MongoDB Atlas ou outro MongoDB com replica set. As reservas e sincronizações usam transações; MongoDB standalone não atende esse requisito.

1. Execute `npm ci` na raiz e `npm ci` em `backend`.
2. Copie `backend/.env.example` para `backend/.env`, configure `MONGODB_URI`, `JWT_SECRET` (32 caracteres ou mais) e `CRON_SECRET`. Gere segredos com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Configure no ambiente privado `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` (10 caracteres ou mais) e o contato real `POUSADA_WHATSAPP`. Execute `npm run provisionar` em `backend`. O script cria a pousada e o dono, não altera uma conta existente e informa apenas o ID da pousada. Remova a senha inicial do ambiente depois.
4. Copie o ID retornado para `POUSADA_PUBLICA_ID`. Sem esse ID, o endpoint de reservas públicas fica desabilitado.
5. Se já houver banco da versão antiga, faça backup e execute `npm run migrar:indices -- --confirmar` em `backend`. Índices novos são criados antes de remover o antigo índice global de messageId; duplicatas interrompem a migração sem apagar registros. Bloqueios legados com horários diferentes de meia-noite UTC precisam ser revisados antes da operação.
6. Na raiz, configure `.env.local` com `VITE_API_URL=http://localhost:3000` e o WhatsApp oficial. Execute `npm run backend:dev` e `npm run dev` em terminais separados.
7. Abra `http://localhost:5173/painel`, entre com a conta criada, troque a senha e cadastre as acomodações e tarifas. Configure dados reais da pousada antes de divulgar o site.

O formulário público escolhe uma acomodação cadastrada e registra uma reserva **pendente** com preço calculado no servidor. Não confirma pagamento nem estadia. Sem `VITE_API_URL`, permanece o envio de solicitação pelo WhatsApp. O painel usa API na mesma origem quando a variável não está definida.

## Calendários e bloqueio manual

Em **Sincronização**, cadastre uma URL iCal externa para cada acomodação/canal e copie o link de exportação correspondente para Airbnb/Booking. O link é `/api/ical/{pousadaId}/{acomodacaoId}.ics?token=...`; `/ical/...` também funciona. Esses links permitem consultar disponibilidade; trate o token como segredo de acesso ao calendário. Regenerar o token invalida os links anteriores.

Após reserva direta, bloqueie as mesmas noites no Airbnb e Booking e confirme no dashboard. Checkout é exclusivo: uma estadia de 10 a 12 bloqueia as noites de 10 e 11. Bloqueios importados, manutenção e conflitos aparecem no calendário. Cancelamentos e eventos removidos do snapshot válido liberam somente bloqueios daquele calendário. Snapshot inválido mantém a última disponibilidade conhecida e gera alerta.

iCal não é tempo real, não sincroniza preços e pode levar minutos ou horas para propagar. Eventos recorrentes não são aceitos: o último snapshot permanece até revisão. A identidade email/iCal é reconciliada quando o calendário fornece um código externo; sem esse código pode haver aviso de possível duplicidade para revisão. Considere um channel manager quando a ocupação tornar essa janela inadequada, em especial acima de 70%.

## E-mail com IA

Configure `LLM_PROVIDER=gemini`, `GEMINI_API_KEY` e `GEMINI_MODEL` no ambiente privado do backend. O modelo padrão é `gemini-3.8-flash`, confirmado no [catálogo oficial do Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) em 8/10/2026. A extração usa generateContent REST e valida o JSON antes de aplicar qualquer alteração. `LLM_PROVIDER=openai` permite a alternativa já existente com `OPENAI_API_KEY` e `OPENAI_MODEL`.

No painel, configure host, porta TLS, usuário e senha de aplicativo IMAP. Senha vazia mantém a atual. Ative o monitoramento somente após preencher a conexão. Emails de Airbnb/Booking/Expedia são processados em lotes de até 100, sem desativar validação TLS. O cursor IMAP permite avançar após mensagens duravelmente encaminhadas à revisão; só sucesso marca a mensagem como lida. E-mails incompletos, quartos ambíguos e notificações de reservas encerradas ficam para revisão. O corpo permanece privado no banco e permite reprocessamento pelo painel.

Notificações automáticas WhatsApp ficam desativadas até configurar Twilio e `WHATSAPP_ENABLED=true` **e** ativar notificações nos dados da pousada. Os testes nunca enviam mensagens reais.

## Cron e publicação

Render: o `render.yaml` prepara backend e frontend. Vercel e Netlify: `vercel.json` e `netlify.toml` preservam as rotas do painel. Configure `VITE_API_URL` com a URL real da API no build do frontend e `ALLOWED_ORIGINS` com as origens autorizadas no backend. Em Render, `TRUST_PROXY=1` corresponde ao proxy da plataforma. O health check `/api/health` responde 200 somente com MongoDB conectado. Backend aguarda a conexão antes de ouvir a porta.

Crie jobs externos POST com `Content-Type: application/json`, cabeçalho `x-cron-secret: <CRON_SECRET>` e body `{}`:

| Endpoint | Frequência |
| --- | --- |
| `/api/sync/ical` | 10 minutos |
| `/api/sync/email` | 5 minutos |
| `/api/sync/saude` | 15 minutos |

O cabeçalho autoriza o cron sem JWT; não inclua segredo na URL. Body `{ "pousadaId": "..." }` limita o job a uma pousada. Os botões do painel usam JWT e endpoints manuais separados. Jobs externos não são criados pelo arquivo de infraestrutura.

A PWA é registrada no build de produção, requer HTTPS (ou localhost) e oferece uma página offline. Dados de hóspedes, API, sessões e respostas privadas não são armazenados pelo service worker. Operações de gestão exigem conexão.

## Verificação e limites

`npm run build` e `npm run test:e2e` na raiz; `npm test` e `npm run lint` em `backend`. A suíte de integração usa um MongoDB replica set temporário, sem tocar no banco configurado em `.env`; pode baixar o binário do MongoDB na primeira execução. Playwright usa Chrome instalado e interfaces externas controladas.

Credenciais IMAP/Gemini/Twilio, Atlas real, publicação e cadastros nas plataformas devem ser configurados e testados na operação. Os checks locais não comprovam entrega de mensagens ou leitura de uma reserva real em cinco minutos. Nenhuma publicação foi realizada nesta implementação.
