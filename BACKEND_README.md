# Pousada Recanto da Paz - Backend

Sistema de gestão de reservas para pousadas com sincronização iCal bidirecional, monitoramento de e-mail com IA e detecção de overbooking.

## Stack
- Node.js + Express + Mongoose + MongoDB Atlas
- Hospedagem: Render (free tier)
- Cron externo: cron-job.org (grátis) - chama endpoints de sincronização a cada 10 min

## Estrutura do Projeto
```
backend/
├── src/
│   ├── config/         # Configurações (DB)
│   ├── controllers/    # Controllers das rotas
│   ├── middleware/     # Auth, rate limit, validação, multi-tenant
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Rotas da API
│   ├── services/       # Lógica de negócio
│   └── server.js       # Entry point
├── .env                # Variáveis de ambiente
├── package.json
└── render.yaml         # Config deploy Render
```

## Modelos de Dados (BLOCO 1)
- **Pousada**: nome, email, whatsapp, plano, icalToken, imapConfig
- **Usuario**: email, senhaHash, pousadaId, role (dono/gestor), primeiroAcesso
- **Acomodacao**: pousadaId, nome, tipo, maxHospedes, camas, valorPadrao, status
- **Tarifa**: pousadaId, acomodacao, data, valor, bloqueado, motivoBloqueio
- **Reserva**: pousadaId, codigo, hospede, acomodacao, checkin, checkout, numHospedes, valorTotal, canal, status, codigoExterno, origem, emailId
- **Bloqueio**: pousadaId, acomodacao, data, origem, referenciaId, hash (dedupe)
- **CalendarioICal**: pousadaId, acomodacao, canal, url, ultimaSincronizacao, status, ultimoErro
- **EmailReserva**: pousadaId, messageId, remetente, assunto, tipo, extraido, reservaId, dadosExtraidos
- **Alerta**: pousadaId, tipo, severidade, mensagem, resolvido, detalhes

## Endpoints da API

### Auth
- `POST /api/auth/login` - Login com JWT
- `POST /api/auth/trocar-senha` - Troca de senha (primeiro acesso)
- `GET /api/auth/me` - Dados do usuário logado

### Acomodações e Tarifas
- `GET /api/acomodacoes` - Listar
- `POST /api/acomodacoes` - Criar
- `PUT /api/acomodacoes/:id` - Atualizar
- `DELETE /api/acomodacoes/:id` - Excluir
- `GET /api/tarifas` - Listar tarifas
- `POST /api/tarifas` - Criar tarifa
- `POST /api/tarifas/lote` - Criar tarifas em lote

### Reservas (Motor Core - BLOCO 3)
- `GET /api/disponibilidade?checkin=&checkout=&hospedes=` - Disponibilidade com preços
- `POST /api/reservas` - Criar reserva (valida disponibilidade, cria bloqueios)
- `GET /api/reservas` - Listar com filtros
- `GET /api/reservas/calendario?ano=&mes=` - Visão mensal
- `GET /api/reservas/overbooking` - Verificar conflitos
- `PATCH /api/reservas/:id/status` - Alterar status (confirmar/cancelar/checkin/checkout)

### iCal Bidirecional (BLOCO 4)
- `GET /ical/:pousadaId/:acomodacaoId.ics?token=` - Export .ics (URL secreta para Airbnb/Booking)
- `GET /api/ical` - Listar calendários configurados
- `POST /api/ical` - Adicionar URL iCal
- `PUT /api/ical/:id` - Atualizar
- `DELETE /api/ical/:id` - Excluir
- `GET /api/ical/status` - Status de sincronização
- `POST /api/sync/ical?secret=` - Sync manual (cron-job.org)
- `POST /api/sync/ical/todas?secret=` - Sync todas pousadas

### E-mail com IA (BLOCO 5)
- `GET /api/emails` - Listar e-mails processados
- `POST /api/emails/:id/reprocessar` - Reprocessar
- `GET /api/email/config` - Ver config IMAP
- `PUT /api/email/config` - Atualizar config IMAP
- `POST /api/sync/email?secret=` - Sync e-mails (cron-job.org)
- `POST /api/sync/email/todas?secret=` - Sync todas pousadas

### Alertas e Dashboard (BLOCO 6/7)
- `GET /api/alertas` - Listar alertas
- `PATCH /api/alertas/:id/resolver` - Marcar como resolvido
- `GET /api/dashboard/stats` - Stats para painel
- `POST /api/sync/saude?secret=` - Verificação de saúde (cron-job.org)

## Configuração

### 1. Variáveis de Ambiente (.env)
Copie `backend/.env.example` para `backend/.env` e preencha:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pousada_recanto

# JWT (gere: openssl rand -base64 32)
JWT_SECRET=seu_secret_32_chars_minimo

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
POUSADA_WHATSAPP_TO=whatsapp:+55DD9NNNNNNNN

# IMAP (Gmail: use App Password)
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_IMAP_USER=seu@gmail.com
EMAIL_IMAP_PASS=sua_senha_app

# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini

# Cron Secret (gere: openssl rand -base64 32)
CRON_SECRET=seu_cron_secret
```

### 2. Deploy no Render
1. Conecte o repositório no Render
2. Crie dois serviços via `render.yaml`:
   - **Web Service** (backend): Node.js, plano Free
   - **Static Site** (frontend): Vite build, plano Free
3. Configure as Environment Variables no dashboard do Render

### 3. Cron-job.org (Sincronização Automática)
Crie 3 jobs no cron-job.org (grátis, executa a cada 10 min):

| Job | URL | Schedule |
|-----|-----|----------|
| Sync iCal | `https://seu-backend.onrender.com/api/sync/ical/todas?secret=SEU_CRON_SECRET` | */10 * * * * |
| Sync E-mail | `https://seu-backend.onrender.com/api/sync/email/todas?secret=SEU_CRON_SECRET` | */10 * * * * |
| Health Check | `https://seu-backend.onrender.com/api/sync/saude?secret=SEU_CRON_SECRET` | */15 * * * * |

## Configuração no Painel (Frontend)

1. Acesse `/painel` no frontend
2. **iCal**: Cole as URLs do Airbnb/Booking por acomodação
3. **E-mail**: Configure IMAP (host, porta, user, senha de app)
4. **Botão "Sincronizar agora"**: Dispara sync manual
5. **Cards de status**: Mostram última sync de cada canal

## Fluxos Principais

### Reserva Direta (Site)
1. Usuário consulta disponibilidade → `GET /api/disponibilidade`
2. Faz reserva → `POST /api/reservas` → Cria Reserva + Bloqueios (uma por noite)
3. Bloqueio aparece no iCal export → Airbnb/Booking puxam no próximo pull

### Reserva Airbnb/Booking (via iCal)
1. Cron-job.org chama `POST /api/sync/ical` a cada 10 min
2. Baixa .ics de cada CalendarioICal configurado
3. Cria/atualiza Bloqueios (origem=ical) com hash para dedupe
4. Atualiza `ultimaSincronizacao`

### Reserva Airbnb/Booking (via E-mail)
1. Cron-job.org chama `POST /api/sync/email` a cada 10 min
2. Conecta IMAP, busca e-mails não lidos de @airbnb.com, @booking.com, @expedia.com
3. Envia corpo para OpenAI (gpt-4o-mini) com prompt de extração
4. Acha acomodação por nome (fuzzy match)
5. Ação conforme tipo: nova/alteração/cancelamento
6. Cria Reserva + Bloqueios ou cancela

### Detecção Overbooking (BLOCO 6)
- A cada sync (iCal ou e-mail): verifica se 2+ canais ocupam mesma acomodação+noite
- Cria Alerta severidade **critica** + envia WhatsApp IMEDIATO
- Health check: se `ultimaSincronizacao > 2h` → Alerta "sincronia parou"
- E-mail não processado > 30min → Alerta

## Segurança (BLOCO 8)
- JWT com segredo em env, expiração 7d
- URLs iCal com token por pousada (revogável)
- Rate limit: auth (5/15min), API (100/15min), sync (10/min)
- Filtro `pousadaId` obrigatório em TODAS as queries (multi-tenant)
- Senhas com bcrypt (12 rounds)

## Limitações (Contrato)
- ⚠️ **Não é tempo real** - Janela de risco residual: até ~10 min
- ⚠️ **Preços não sincronizados** - Atualizar manualmente em cada plataforma
- ✅ **Recomendado channel manager (R$150-400/mês)** se ocupação > 70%

## Desenvolvimento Local
```bash
# Instalar dependências
npm run install:all

# Rodar frontend + backend
npm run dev          # Frontend (Vite) - porta 5173
npm run backend:dev  # Backend (Node --watch) - porta 3000
```

## Testes
```bash
cd backend
npm test
```

## Estrutura de Pastas Frontend (Existente)
```
src/
├── components/       # Componentes React (Hero, Reservation, etc.)
├── App.jsx
├── main.jsx
└── index.css
```

## Próximos Passos (Opcionais)
- [ ] Pagamento (Asaas/Mercado Pago)
- [ ] Webhooks para confirmação de pagamento
- [ ] Relatórios financeiros
- [ ] App mobile (React Native)
- [ ] Multi-idioma