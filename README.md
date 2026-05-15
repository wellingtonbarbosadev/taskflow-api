# Taskflow API

API REST para gerenciamento de times e tarefas, com autenticação JWT e controle de acesso por perfil (`admin` e `member`).

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod (validação)
- JWT (autenticação)

## Funcionalidades

- Cadastro e listagem de usuários
- Login com geração de token JWT
- Gestão de times (CRUD)
- Gestão de membros dos times
- Gestão de tarefas (CRUD)
- Histórico de alteração de status das tarefas
- Filtros de tarefas por status e prioridade
- Controle de autorização por perfil

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- Docker e Docker Compose (opcional, recomendado para banco local)

## Configuração do ambiente

1. Instale as dependências:

```bash
npm ci
```

2. Crie o arquivo `.env` com base no `.envexample` (nome usado neste projeto):

```bash
cp .envexample .env
```

3. Configure as variáveis:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow?schema=public
JWT_SECRET=sua_chave_jwt
```

## Banco de dados

### Subir PostgreSQL com Docker

```bash
docker compose up -d
```

### Rodar migrations

```bash
npx prisma migrate dev
```

> As migrations já existentes estão em `prisma/migrations`.
## Executando a aplicação

### Desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
npm start
```

## Scripts disponíveis

- `npm run dev` — sobe a API em modo desenvolvimento
- `npm run build` — gera build em `build/`
- `npm start` — executa a aplicação compilada
- `npm test` — atualmente não há testes automatizados configurados

## Autenticação e autorização

- O login retorna um token JWT com validade de **1 dia**.
- Envie o token no header:

```http
Authorization: Bearer <token>
```

- Regras principais:
  - Rotas de times: apenas `admin`
  - Criar/excluir tarefas: apenas `admin`
  - Editar tarefas: `admin` edita tudo; `member` altera apenas `status` de tarefa atribuída a ele
  - Listar tarefas: `member` vê apenas tarefas atribuídas a ele

## Endpoints

Base URL local: `http://localhost:3333`

### Usuários

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/users` | Lista usuários | Não |
| POST | `/users` | Cadastra usuário | Não |

#### Exemplo `POST /users`

```json
{
  "name": "Wellington",
  "email": "wellington@email.com",
  "password": "123456"
}
```

### Sessões

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/sessions` | Login e geração de token | Não |

#### Exemplo `POST /sessions`

```json
{
  "email": "wellington@email.com",
  "password": "123456"
}
```

### Times (`admin`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/teams` | Lista times |
| POST | `/teams` | Cria time |
| PATCH | `/teams/:teamId` | Atualiza time |
| DELETE | `/teams/:teamId` | Remove time |
| GET | `/teams/:teamId/member` | Lista membros do time |
| POST | `/teams/:teamId/member/:userId` | Adiciona membro ao time |
| DELETE | `/teams/:teamId/member/:userId` | Remove membro do time |

### Tarefas (auth obrigatória)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tasks` | Lista tarefas (filtros: `status`, `priority`) |
| POST | `/tasks` | Cria tarefa (`admin`) |
| PATCH | `/tasks/:taskId` | Edita tarefa |
| DELETE | `/tasks/:taskId` | Remove tarefa (`admin`) |
| GET | `/tasks/:taskId/history` | Histórico de status da tarefa |

#### Exemplo `POST /tasks`

```json
{
  "title": "Implementar autenticação",
  "description": "Adicionar JWT na API",
  "status": "pending",
  "priority": "high",
  "assignedTo": 2,
  "teamId": 1
}
```

#### Exemplo `PATCH /tasks/:taskId` (member)

```json
{
  "status": "in_progress"
}
```

## Respostas de erro

- Erros de domínio/autorização:

```json
{
  "message": "Unauthorized"
}
```

- Erros de validação (Zod):

```json
{
  "message": "validation error",
  "issues": {}
}
```

## Licença

ISC
