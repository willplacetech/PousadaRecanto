# Pousada Recanto da Paz

Página em React com Vite, recuperada da prévia original da Emergent e dos arquivos HTML salvos. Os componentes são editáveis em `src/components/`.

## Executar

Requer Node.js 22.12 ou superior.

```sh
npm install
npm run dev
```

Abra a URL indicada pelo Vite. Para gerar a versão de produção, execute `npm run build`. Os arquivos ficam em `dist/`; `npm run preview` permite conferi-los localmente.

## Visual e animações

Foram recuperados os componentes originais e os parâmetros do Framer Motion: entrada do título, parallax da foto principal, revelação das seções, transição do menu no celular, galeria com ampliação e navegação por teclado. A rolagem suave usa Lenis; a faixa de texto e os efeitos de hover usam CSS.

As seis fotografias originais estão em `public/photos/`. As fontes Cormorant Garamond e Plus Jakarta Sans estão em `public/fonts/`. Fotos, fontes e favicon são servidos localmente; o mapa continua utilizando o Google Maps.

Os estilos usam Tailwind CSS. Cores, fontes, sombras e a animação da faixa de texto estão em `tailwind.config.js`; estilos globais estão em `src/index.css`.

## Reservas e contatos

Copie `.env.example` para `.env.local` e preencha os valores desejados:

- `VITE_WHATSAPP_NUMBER`: número oficial com país e DDD, somente dígitos. A referência original não informava um número; sem configuração, o WhatsApp solicita a escolha do contato.
- `VITE_AIRBNB_URL`: link oficial do anúncio. A referência apontava para a página inicial do Airbnb.
- `VITE_API_URL`: servidor opcional, sem `/api` no final. Quando configurado, o formulário consulta as acomodações e envia a solicitação para `/api/publico/reservas`, exibindo o código e o valor calculados pelo servidor. O servidor precisa permitir a origem do site via CORS. Sem API, o formulário encaminha a solicitação pelo WhatsApp.

Sem servidor configurado, o formulário valida os dados e abre uma solicitação pronta no WhatsApp. Com `VITE_API_URL`, consulta as acomodações cadastradas e registra uma reserva pendente pela API pública em `/api/publico/reservas`, com preço calculado no servidor. A confirmação continua a depender da pousada.

## Gestão da pousada

O painel em `/painel` inclui login, alertas e bloqueio manual, reservas, calendário por canal, acomodações, tarifas, iCal, e-mail com Gemini e configurações. O backend está em `backend/` e usa MongoDB com replica set. A PWA oferece instalação e página offline; operações de gestão exigem conexão.

Veja [as instruções de primeiro acesso, cron e publicação](docs/operacao.md). Elas explicam como provisionar o dono, configurar credenciais reais e habilitar a reserva pública. `npm run backend:dev` inicia a API; `npm run dev` inicia o frontend.

Reinicie o Vite após alterar as variáveis. Elas são públicas e não devem conter segredos.

## Verificar

```sh
npm run build
npm run test:e2e
```

Os testes usam Google Chrome instalado. Verificam o site, o painel e a integração pública com API controlada, sem enviar mensagens nem registrar reservas em contas reais. Em `backend`, `npm test` verifica também transações com um MongoDB replica set temporário; `npm run lint` confere o código da API.

## Arquivos de referência

`Loading....html` e `Loading..._files/` são os arquivos fornecidos e foram preservados. A página completa está no iframe salvo como `Loading..._files/saved_resource(1).html`. Os fontes JSX foram recuperados dos mapas de código públicos da prévia estática correspondente.
