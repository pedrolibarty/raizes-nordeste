# Raízes do Nordeste

API REST para gerenciamento de uma rede de lanchonetes, desenvolvida como Projeto Multidisciplinar da trilha Back-End.

O sistema oferece gerenciamento de filiais, funcionários, clientes, produtos, estoque, pedidos, promoções, pagamentos simulados e programa de fidelidade. A aplicação também implementa autenticação JWT, autorização por perfis e separação das operações por filial.

## Funcionalidades

- Cadastro e autenticação de funcionários e clientes.
- Controle de acesso por perfil.
- Gestão de filiais.
- Cardápio de produtos por filial.
- Controle automático de estoque.
- Registro de movimentações de entrada e saída.
- Pedidos com múltiplos itens.
- Cálculo de preços, descontos e pontos no back-end.
- Promoções por produto.
- Pagamento simulado com aprovação, recusa e erro técnico.
- Programa de fidelidade com consentimento e histórico de pontos.
- Auditoria de operações sensíveis.
- Documentação OpenAPI/Swagger.
- Testes de integração dos fluxos principais.

## Tecnologias

- Node.js
- JavaScript com ES Modules
- Express
- PostgreSQL
- TypeORM com `EntitySchema`
- JWT
- bcrypt
- Jest
- Supertest
- Swagger/OpenAPI
- Insomnia

## Estrutura do projeto

```text
src/
├── __tests__/          # Testes de integração
├── config/             # Configurações, como Swagger
├── constants/          # Papéis, tipos e status aceitos
├── controllers/        # Entrada e resposta HTTP
├── entities/           # Entidades do TypeORM
├── errors/             # Erros da aplicação
├── middlewares/        # Autenticação, autorização e validações
├── migrations/         # Versionamento do banco de dados
├── routes/             # Definição dos endpoints
├── seeds/              # Inicialização dos dados administrativos
├── services/           # Regras de negócio
├── app.js              # Configuração do Express
├── data-source.js      # Configuração do TypeORM
└── server.js           # Inicialização da aplicação
```

## Pré-requisitos

- Node.js 20 ou superior.
- PostgreSQL instalado e em execução.
- Um banco vazio para desenvolvimento.
- DBeaver, `psql` ou outro cliente PostgreSQL para administração local.

O projeto não necessita de Docker.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/pedrolibarty/raizes-nordeste.git
cd raizes-nordeste
```

Instale as dependências:

```bash
npm ci
```

Se estiver desenvolvendo e tiver alterado dependências, utilize `npm install` para atualizar também o `package-lock.json`.

## Configuração do ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=raizes_nordeste
DB_DATABASE_TEST=raizes_nordeste_test

JWT_SECRET=uma_chave_secreta_longa_e_aleatoria
JWT_EXPIRES_IN=1d

SEED_ADMIN_NAME=Odin
SEED_ADMIN_EMAIL=odin@example.com
SEED_ADMIN_PASSWORD=uma_senha_segura
SEED_BRANCH_CODE=1
SEED_BRANCH_NAME=Raízes do Nordeste - Midgard
```

Nunca envie o arquivo `.env` ao GitHub.

## Banco de dados

Crie o banco principal no PostgreSQL:

```sql
CREATE DATABASE raizes_nordeste;
```

Execute as migrations:

```bash
npm run migration:run
```

Crie a primeira filial e o primeiro administrador:

```bash
npm run seed
```

O seed é idempotente e pode ser executado novamente sem duplicar registros.

## Execução

Ambiente de desenvolvimento:

```bash
npm run dev
```

Execução normal:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

Verificação de funcionamento:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok",
  "message": "API is running."
}
```

## Documentação da API

Com a aplicação em execução, acesse:

```text
http://localhost:3000/api-docs
```

O Swagger apresenta os endpoints, parâmetros, corpos de requisição, autenticação e respostas esperadas.

## Autenticação

Existem dois tipos de autenticação:

```http
POST /users/login
POST /clients/login
```

As rotas protegidas utilizam JWT:

```http
Authorization: Bearer SEU_TOKEN
```

### Perfis de funcionários

| Perfil | Responsabilidade principal |
| --- | --- |
| `ADMIN` | Acesso administrativo a todas as filiais |
| `MANAGER` | Gestão operacional da própria filial |
| `ATTENDANT` | Atendimento, pedidos e entrega |
| `KITCHEN` | Preparação e finalização dos itens |

Clientes possuem autenticação própria e só podem acessar seus próprios dados, pedidos, pagamentos e conta de fidelidade.

## Principais endpoints

### Filiais

```http
POST   /branches
GET    /branches
GET    /branches/:id
PATCH  /branches/:id
DELETE /branches/:id
```

### Funcionários

```http
POST   /users/login
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

### Clientes

```http
POST   /clients
POST   /clients/login
GET    /clients
GET    /clients/:id
PATCH  /clients/:id
DELETE /clients/:id
```

### Produtos e cardápio

```http
POST   /products
GET    /products
GET    /products/branch/:branchId
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id
```

### Estoque e movimentações

O estoque é criado automaticamente junto com o produto. Sua quantidade é alterada por movimentações manuais ou por operações internas, como a aprovação e o cancelamento de pedidos.

```http
GET  /inventory
GET  /inventory/:id
GET  /inventory/product/:productId
GET  /inventory/branch/:branchId

POST /movements
GET  /movements
GET  /movements/:id
```

Movimentações são imutáveis. Uma correção deve ser registrada por uma nova movimentação.

### Promoções

```http
POST   /promotions
GET    /promotions
GET    /promotions/:id
PATCH  /promotions/:id
DELETE /promotions/:id
```

### Pedidos e itens

```http
POST   /orders
GET    /orders
GET    /orders/:id
PATCH  /orders/:id/status
PATCH  /orders/:id/cancel

POST   /orders/:orderId/items
PATCH  /orders/:orderId/items/:itemId
DELETE /orders/:orderId/items/:itemId
```

Exemplo de pedido:

```json
{
  "branchId": "UUID_DA_FILIAL",
  "orderChannel": "APP",
  "items": [
    {
      "productId": "UUID_DO_PRODUTO",
      "quantity": 2,
      "notes": "Sem manteiga"
    }
  ]
}
```

Funcionários podem informar `clientId` opcionalmente. O cliente autenticado sempre cria o pedido para si.

Preços, descontos, totais e pontos enviados pelo consumidor são ignorados. Esses valores são calculados pela API.

### Pagamento mock

```http
POST /payments/mock/approved
POST /payments/mock/declined
POST /payments/mock/error
GET  /payments
GET  /payments/:id
```

Corpo da tentativa:

```json
{
  "orderId": "UUID_DO_PEDIDO",
  "paymentMethod": "PIX"
}
```

| Resultado | Pagamento | Pedido | Estoque |
| --- | --- | --- | --- |
| `approved` | aprovado | pago | reduzido |
| `declined` | recusado | aguardando pagamento | inalterado |
| `error` | erro técnico | aguardando pagamento | inalterado |

Em caso de recusa ou erro, o pedido não é perdido e uma nova tentativa pode ser realizada.

### Fidelidade

```http
POST   /loyalty-accounts
GET    /loyalty-accounts
GET    /loyalty-accounts/:id
PATCH  /loyalty-accounts/:id
DELETE /loyalty-accounts/:id

POST   /loyalty-transactions
GET    /loyalty-transactions
GET    /loyalty-transactions/:id
```

O cliente precisa fornecer consentimento para participar. Os pontos promocionais são creditados automaticamente quando o pedido é entregue.

## Canais de pedido

| Valor | Origem |
| --- | --- |
| `APP` | Aplicativo |
| `TOTEM` | Totem de autoatendimento |
| `BALCAO` | Balcão |
| `PICKUP` | Retirada |
| `WEB` | Plataforma web |

## Status

### Pedidos

| Sigla | Significado |
| --- | --- |
| `A` | Aguardando pagamento |
| `P` | Pago |
| `C` | Em preparação |
| `R` | Pronto |
| `E` | Entregue |
| `X` | Cancelado |

Fluxo normal:

```text
A → P → C → R → E
```

### Pagamentos

| Sigla | Significado |
| --- | --- |
| `P` | Pendente |
| `A` | Aprovado |
| `N` | Negado |
| `E` | Erro |
| `C` | Cancelado |
| `R` | Reembolsado ou estornado |

### Movimentações de estoque

| Sigla | Significado |
| --- | --- |
| `E` | Entrada |
| `S` | Saída |

### Transações de fidelidade

| Sigla | Significado |
| --- | --- |
| `E` | Entrada de pontos |
| `S` | Saída ou resgate de pontos |

## Testes

Crie um banco exclusivo para testes:

```sql
CREATE DATABASE raizes_nordeste_test;
```

Execute:

```bash
npm test
```

Os testes usam somente o banco informado em `DB_DATABASE_TEST` e cobrem autenticação, permissões, pedidos, estoque, pagamento mock e fidelidade.

## Testes com Insomnia

Fluxo recomendado:

1. Execute o seed.
2. Faça login como administrador.
3. Cadastre funcionários.
4. Cadastre um cliente e faça login.
5. Cadastre produto e adicione estoque.
6. Crie uma promoção.
7. Crie um pedido.
8. Teste pagamento recusado e nova tentativa.
9. Teste pagamento aprovado.
10. Atualize o pedido até `E`.
11. Confira estoque, movimentações e pontos.

Ao exportar o workspace do Insomnia, remova tokens reais e senhas do ambiente compartilhado.

## Regras importantes

- Produtos pertencem a uma filial.
- Cada produto possui um estoque único.
- Funcionários não administradores operam apenas na própria filial.
- O último item de um pedido não pode ser removido.
- Itens só podem ser alterados enquanto o pedido aguarda pagamento.
- Pedidos e movimentações não são excluídos fisicamente durante o fluxo operacional.
- Estoque não pode ficar negativo.
- O pagamento aprovado reduz o estoque uma única vez.
- Cancelamentos elegíveis devolvem o estoque.
- Pontos não podem produzir saldo negativo.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Executa com Nodemon |
| `npm start` | Executa normalmente |
| `npm run migration:run` | Executa migrations pendentes |
| `npm run migration:revert` | Reverte a última migration |
| `npm run seed` | Cria filial e administrador iniciais |
| `npm test` | Executa os testes de integração |
| `npm run test:watch` | Executa testes em modo de observação |

## Segurança

- Autenticação baseada em JWT.
- Senhas protegidas por hash com bcrypt.
- Autorização baseada em papel e filial.
- Validação de dados de entrada.
- Valores monetários calculados no servidor.
- Dados sensíveis não são registrados em logs.
- Consentimento explícito para o programa de fidelidade.

## Autor

Pedro Libarty

Projeto acadêmico desenvolvido para a trilha Back-End.
