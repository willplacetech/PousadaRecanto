# API de gestão da pousada

Node.js + Express + Mongoose, com reservas transacionais, calendário iCal, leitura IMAP e extração Gemini (OpenAI opcional). Requer MongoDB replica set, como Atlas. O servidor aguarda o banco antes de iniciar e não exige chaves de IA ou Twilio para iniciar os módulos independentes.

Use [docs/operacao.md](docs/operacao.md) para primeiro acesso, variáveis, migração de índices, cron e publicação. Em `backend`: `npm ci`, `npm run provisionar` (com dados privados configurados), `npm run dev`.

| Área | Endpoints |
| --- | --- |
| Saúde | `GET /api/health`, alias `/health` |
| Conta | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/trocar-senha` |
| Pousada | `GET/PUT /api/pousada`, `POST /api/pousada/ical-token` |
| Reservas públicas | `GET /api/publico/acomodacoes`, `POST /api/publico/reservas` |
| Acomodações | `GET/POST /api/acomodacoes`, `GET/PUT/DELETE /api/acomodacoes/:id` |
| Tarifas | `GET/POST /api/tarifas`, `POST /api/tarifas/lote`, `PUT/DELETE /api/tarifas/:id` |
| Reservas | `GET/POST /api/reservas`, `GET /api/disponibilidade`, `GET /api/reservas/calendario`, `PATCH /api/reservas/:id/status`, `PATCH /api/reservas/:id/bloqueio-manual` |
| Alertas | `GET /api/alertas`, `PATCH /api/alertas/:id/resolver`, `GET /api/dashboard/stats` |
| iCal | `GET/POST /api/ical`, `PUT/DELETE /api/ical/:id`, `GET /api/ical/status`, `GET /api/ical/:pousadaId/:acomodacaoId.ics?token=...` |
| E-mail | `GET /api/emails`, `GET /api/emails/:id`, `POST /api/emails/:id/reprocessar`, `GET/PUT /api/email/config` |
| Sync manual | `POST /api/ical/sincronizar`, `POST /api/email/sincronizar` (JWT do painel) |
| Cron | `POST /api/sync/ical`, `/api/sync/email`, `/api/sync/saude` (cabeçalho `x-cron-secret`, sem JWT) |

Rotas de gestão usam JWT e contexto da pousada no servidor. `visualizacao` permite leitura de entidades e troca da própria senha, sem escrita de reservas ou configurações. Senhas IMAP não retornam pela API. Reserva pública usa apenas `POUSADA_PUBLICA_ID` do servidor, não aceita preço nem pousada enviados pelo visitante, e protege disponibilidade concorrente por acomodação. Exclusão de acomodações preserva histórico.

Verifique com `npm test` e `npm run lint`. Integrações reais exigem configuração e validação no ambiente de operação; os testes usam banco temporário e fronteiras externas controladas.
