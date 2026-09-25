# DG Concierge Brasil

Plataforma de captação e acompanhamento de solicitações para assessoria de ingressos e experiências. Criada com Next.js App Router, PostgreSQL e Drizzle ORM.

## Jornada do cliente

1. Conhece as experiências e escolhe um plano em `/`.
2. Envia uma solicitação sem pagamento nesta etapa.
3. Recebe um protocolo e acompanha o andamento em `/acompanhar` usando protocolo e e-mail.
4. Recebe contato individual da equipe para avaliar disponibilidade, valores dos ingressos e taxa de assessoria antes de aprovar uma compra.

A procedência dos ingressos adquiridos pela operação é priorizada em canais oficiais/autorizados. Disponibilidade nunca é prometida antes da confirmação.

## Operação comercial

O painel em `/admin` permite pesquisar solicitações, abrir o WhatsApp do cliente, registrar observações internas e atualizar as etapas visíveis para o cliente. O acesso exige `DG_ADMIN_PASSWORD` (mínimo de 12 caracteres) no ambiente. Uma senha aleatória foi criada na `.env` local do projeto; use uma credencial segura própria em produção.

Planos exibidos no site: Essencial a partir de R$ 149, Signature a partir de R$ 349 e Privé mediante proposta. São taxas de assessoria por solicitação; ingressos e despesas adicionais são apresentados à parte. Os valores podem ser ajustados nos dados de `src/components/landing-page.tsx` conforme a estratégia comercial.

## Configuração

Copie o modelo de `.env.example` para `.env` e configure `DATABASE_URL` e `DG_ADMIN_PASSWORD`. Depois, aplique o esquema com `npx drizzle-kit push`. O projeto usa `npm run dev` para desenvolvimento e `npm run build` para gerar a versão de produção.

## Rotas principais

- `/` — vitrine, planos, dúvidas e formulário.
- `/acompanhar` — consulta protegida por protocolo + e-mail.
- `/admin` — gestão operacional protegida por senha.
- `/privacidade` — informações sobre uso dos dados.
- `/api/solicitacoes` — criação e consulta de pedidos.
- `/api/admin/session` e `/api/admin/solicitacoes` — autenticação e gestão interna.

O projeto não processa pagamentos nem executa compras automáticas. A equipe conduz a operação de forma assistida, após aprovação do cliente.
