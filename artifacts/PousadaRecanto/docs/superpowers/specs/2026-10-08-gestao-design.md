# Gestão completa da pousada

O pedido autoriza completar o documento fornecido e corrigir a auditoria de 8/10/2026. Preservar o site atual e adicionar painel React em /painel, com login, dashboard de alertas, reservas e filtros, calendário mensal por canal, acomodações/tarifas, sincronização e configuração. PWA instala o aplicativo e mostra estado offline sem cachear dados privados.

Backend Express/Mongoose mantém nomenclatura camelCase existente. Datas de hospedagem são dias civis YYYY-MM-DD, representados à meia-noite UTC; checkout é exclusivo. Reservas usam transações MongoDB replica set e proteção contra concorrência por acomodação. Isolamento por pousada e autorização dono/gestor/visualizacao devem cobrir todos os endpoints. Configuração não expõe senha IMAP ou chaves da IA. Conta inicial é provisionada por script local com valores de ambiente.

O site usa /api/publico/acomodacoes e POST /api/publico/reservas, vinculados somente à POUSADA_PUBLICA_ID configurada no servidor. Cliente escolhe uma acomodação real; preço vem do servidor e reserva nasce pendente com bloqueios imediatos. Conflito retorna 409 e gera alerta, sem reserva duplicada. Sem API configurada continua a solicitação WhatsApp existente.

iCal exporta bloqueios com token, identificadores estáveis e sem dados pessoais; importação reconcilia noites de cada calendário após download válido, incluindo cancelamentos e eventos removidos. Evitar retroalimentação dos próprios eventos. Detecção reconhece conflitos de reservas e bloqueios externos, deduplica alertas e reconcilia email/iCal pelo código externo quando disponível.

E-mail usa Gemini por padrão, com OpenAI opcional. IMAP verifica TLS, deduplica por pousada/messageId, processa sequencialmente, marca lido somente após processamento e guarda corpo para reprocessamento. Dados incompletos ou acomodação ambígua exigem revisão; nunca escolher primeiro quarto por suposição. Alteração e cancelamento usam código e canal, sem exigir campos ausentes no cancelamento.

Cron valida x-cron-secret sem JWT; painel dispara sync autenticada sem revelar segredo. Frequências documentadas: iCal 10 minutos, email 5 minutos, saúde 15 minutos. Credenciais e publicação real são etapas externas, não devem ser simuladas. WhatsApp é opcional e só envia quando explicitamente ativado por configuração.

Validação: regressões Vitest dos modelos, reservas, reconciliação, email, autenticação/cron; banco efêmero replica set para integração quando disponível; Playwright dos fluxos do painel com API controlada; build e lint. Documentar limites externos e estado dos checks.
