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
- `VITE_API_URL`: servidor opcional, sem `/api` no final. Quando configurado, o formulário envia um POST para `/api/reservations` antes de abrir o WhatsApp. O servidor precisa permitir a origem do site via CORS.

Sem servidor configurado, o formulário valida os dados e abre uma solicitação pronta no WhatsApp. Ele não registra nem confirma reservas automaticamente. A confirmação depende da pousada. O backend da Emergent não faz parte dos arquivos recuperados.

Reinicie o Vite após alterar as variáveis. Elas são públicas e não devem conter segredos.

## Verificar

```sh
npm run build
npm run test:e2e
```

Os testes usam Google Chrome instalado. Verificam fotos e fontes locais, galeria, validação do formulário, preparação da mensagem do WhatsApp e menu no celular. Eles não enviam mensagens nem registram reservas reais.

## Arquivos de referência

`Loading....html` e `Loading..._files/` são os arquivos fornecidos e foram preservados. A página completa está no iframe salvo como `Loading..._files/saved_resource(1).html`. Os fontes JSX foram recuperados dos mapas de código públicos da prévia estática correspondente.
