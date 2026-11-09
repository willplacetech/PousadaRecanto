# Auditoria de implementação — 8 de outubro de 2026

Referência: documento “Sistema de Gestão de Pousada — Recanto da Paz” anexado pelo usuário. Escopo: arquivos locais e verificações locais; integrações reais e publicação não foram comprovadas. Nenhum código funcional foi alterado.

**Conclusão: a implementação está parcial e contém impedimentos funcionais.**

| Fase | Situação observada |
| --- | --- |
| 0 — Requisitos | Apenas parte dos fluxos está presente. |
| 1 — Modelos | Os oito modelos existem, além de Tarifa; há incompatibilidades entre modelos e serviços. |
| 2 — API | Rotas de autenticação, acomodações, tarifas, reservas e alertas presentes. Não há API de configuração da pousada nem fluxo de provisionamento inicial encontrado. Health em `/health`, diferente de `/api/health` no anexo. |
| 3 — Exportação iCal | Implementada em código, com token. Caminho real `/api/ical/:pousadaId/:acomodacaoId.ics`, diferente do anexo. Sem teste com plataformas reais. |
| 4 — Importação iCal | Parcial: adiciona bloqueios, mas não reconcilia remoções, cancelamentos ou mudanças de datas. |
| 5 — E-mail com IA | Código presente, com falhas impeditivas; usa OpenAI em vez de Gemini. |
| 6 — Conflitos e alertas | Parcial: existem verificações, mas conflitos com bloqueios iCal não geram o alerta esperado e não há dashboard visual. |
| 7 — Bloqueio manual | API parcial; tipo de alerta rejeitado pelo modelo, resolução usa campo incorreto e interface ausente. |
| 8 — Painel completo | Ausente: App renderiza apenas o site público. Sem login visual, dashboard, telas de gestão, calendário colorido, rotas protegidas ou PWA. |
| 9 — Implantação | Blueprint Render e instruções existem. MongoDB, publicação, cron, IMAP e configuração nas plataformas não comprovados. |

## Impedimentos e inconsistências

1. `src/components/Reservation.jsx:66`: formulário envia `/api/reservations`, enquanto backend oferece `/api/reservas`, exige JWT e espera outro formato de dados. Não há integração funcional do site com o motor de reservas.
2. `backend/src/models/Reserva.js:5` e `:31`: código obrigatório é gerado em `pre('save')`, após a validação. Controllers e serviços não fornecem código. Validação local confirmou rejeição de reserva sem código.
3. `backend/src/models/Alerta.js:5`: enum não aceita `bloqueio_manual_pendente`, criado por `reservaService.js`. Validação local confirmou rejeição.
4. `backend/src/controllers/reservaController.js:115`: confirmação procura `referencia`, mas criação grava `detalhes.reservaId`. Cálculo de tempo usa `createdAt`, enquanto Alerta tem `data`.
5. `backend/src/services/emailService.js:303`: `imap` e `mailparser` são importados, mas não declarados nas dependências. Resolução local de ambos falhou.
6. `emailService.js:46` e `:92`: extração retorna dados diretamente, enquanto consumidor desestrutura `dadosExtraidos`. Resultado bem-sucedido deixa esse campo indefinido.
7. Serviço de e-mail cria hóspede com email e telefone vazios, rejeitados pelo schema. Validação local reproduziu esses erros.
8. Rotas de sincronização iCal, e-mail e saúde ficam depois de autenticação JWT. O segredo de cron sozinho, como documentado, não permite acesso. Controllers leem segredo na query, diferente do cabeçalho `x-cron-secret` do anexo.
9. `icalService.js:151`: importação acrescenta noites; não remove noites que sumiram nem trata `CANCELLED`. Pode manter indisponibilidade após cancelamento ou alteração.
10. `reservaService.js:301`: detecção exige pelo menos duas referências de Reserva. Bloqueios iCal referenciam CalendarioICal, portanto conflito entre iCal e uma reserva local não satisfaz essa condição. Criação direta apenas rejeita conflito sem criar alerta crítico.
11. `reservaService.js:96`: preço sem tarifa diária cai para zero, sem usar `Acomodacao.valorPadrao`. Endpoint GET disponibilidade aplica validador que lê body, apesar das datas na query.

## Verificações executadas

- Dependências do frontend instaladas com `npm ci --ignore-scripts --no-audit --no-fund`.
- `npm run build`: aprovado.
- `npm run test:e2e`: três casos do site público aprovados; não cobrem gestão nem integrações reais.
- `npm test` em backend: falhou, nenhum arquivo de teste encontrado.
- `npm run lint` em backend: falhou, falta configuração ESLint.
- Importação/inicialização do servidor: iniciou escuta e encerrou por `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`; a conexão configurada localmente não foi validada.
- Validações Mongoose sem banco: reproduziram código obrigatório ausente, dados de hóspede inválidos e tipo de alerta não aceito.
- Arquivos locais não comprovam Atlas conectado, serviços publicados, jobs externos, URLs cadastradas em Airbnb/Booking, senha de aplicativo IMAP, entrega WhatsApp ou reserva externa aparecendo em cinco minutos.
