# TaskFlow

Aplicação full-stack para gerenciamento de tarefas internas, desenvolvida como solução completa (opção 4) para o desafio técnico de estágio em desenvolvimento de software.

A aplicação permite criar, listar, editar, excluir (extra), buscar e filtrar tarefas, além de refletir automaticamente o estado de atraso quando a data limite de uma tarefa é ultrapassada.

## Visão geral

O projeto foi desenvolvido com uma arquitetura simples e organizada, separando back-end e front-end em duas aplicações independentes dentro do mesmo repositório.

A solução contém:

- API REST com persistência em banco SQLite;
- interface web em React;
- documentação da API com Swagger/OpenAPI;
- validações de entrada;
- tratamento centralizado de erros;
- testes automatizados no back-end;
- Docker e Docker Compose;
- cuidados básicos de segurança, como rate limit, Helmet, CORS configurado e limite de payload.

## Funcionalidades

- Listar tarefas;
- Criar nova tarefa;
- Editar tarefa existente;
- Excluir tarefa;
- Alterar status da tarefa;
- Filtrar tarefas por status;
- Buscar tarefas por título ou descrição;
- Exibir tarefas atrasadas com base na data limite;
- Manter tarefa concluída como concluída, mesmo que a data limite esteja vencida;
- Feedback visual de carregamento, sucesso e erro na interface.

## Regras de negócio atendidas

- Toda tarefa deve ter título e status;
- Não é possível salvar tarefa sem título;
- A data de criação é preenchida automaticamente pelo back-end;
- Ao marcar uma tarefa como `CONCLUIDO`, ela permanece concluída;
- Uma tarefa não concluída com data limite vencida é refletida como `ATRASADO`;
- O filtro por status funciona corretamente;
- A busca considera título e descrição.

## Tecnologias utilizadas

### Back-end

- Node.js;
- TypeScript;
- Express;
- Prisma ORM;
- SQLite;
- Zod;
- Swagger/OpenAPI;
- Vitest;
- Supertest;
- Helmet;
- CORS;
- Express Rate Limit;
- Docker.

### Front-end

- React;
- TypeScript;
- Vite;
- Axios;
- CSS puro;
- Docker com Nginx para servir o build estático.

## Estrutura de pastas

```txt
taskflow-facilit/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

# Como rodar com Docker:

## Pré Requisitos

- Docker;
- Docker Compose.

Na raiz do projeto, rode o comando:

```
docker compose up --build
```

Logo depois, tente acessar:

```
Front-end: http://localhost:5173
Back-end:  http://localhost:3333
Swagger:   http://localhost:3333/docs
```

Pra parar os containers:

```
docker compose down (ou simplesmente 'Ctrl + C' a depender do terminal)
```

Pra parar e remover o volume do banco SQLite:

```
docker compose down -v
```

# Como rodar localmente:

## Backend:
Entre na pasta backend:
```
cd backend
```

Instale as dependências:
```
npm install
```

Crie um arquivo `.env` com base no `.env.example`:
```
PORT=3333
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Execute as migrations:
```
npx prisma migrate dev
```

Gere o Prisma Client:
```
npx prisma generate
```

Inicie:
```
npm run dev
```

A API estará disponível em:
```
http://localhost:3333
```

## Frontend

Em outro terminal, na pasta do frontend:
```
cd frontend
```

Instale as dependências:
```
npm install
```

Crie um arquivo `.env` com base no `.env.example`:
```
VITE_API_URL=http://localhost:3333/api
```

Inicie:
```
npm run dev
```

A interface estará disponível em:
```
http://localhost:5173
```

# Documentação:
Com a API em execução, dá pra acessar a documentação Swagger pela url:
```
http://localhost:3333/docs
```

## Principais endpoints:
```
GET    /api/health
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

## Filtros e buscas:
1. Listar todas as tarefas:
```
GET /api/tasks
```

2. Filtrar por status:
```
GET /api/tasks?status=A_FAZER
```

3. Buscar por título ou descrição:
```
GET /api/tasks?search=documentação
```

4. Combinar filtro e busca:
```
GET /api/tasks?status=EM_PROGRESSO&search=api
```

## Status disponíveis:
Basicamente, internamente os status são representados como enum:
```
A_FAZER
EM_PROGRESSO
ATRASADO
CONCLUIDO
```

Mas são exibidos na interface como:
```
A Fazer
Em Progresso
Atrasado
Concluído
```

Pra que não haja problema em relação à acentuação, etc.

## Coleção Postman

Uma coleção Postman está disponível em:

```txt
docs/taskflow.postman_collection.json
```

Para utilizar, importe o arquivo no Postman e configure a variável `taskId` após criar uma tarefa.

## Decisão sobre tarefas atrasadas:

O status `ATRASADO` é tratado como um estado calculado pela aplicação.

O usuário pode selecionar manualmente os status `A_FAZER`, `EM_PROGRESSO` e `CONCLUIDO`. Já o status `ATRASADO` é retornado automaticamente pela API no campo `computedStatus` quando a tarefa não está concluída e sua data limite é anterior à data atual.

Essa decisão evita inconsistências, como marcar manualmente uma tarefa como atrasada mesmo quando ela ainda está dentro do prazo.

## Testes:
Os testes automatizados foram criados para o backend usando Vitest e Supertest.

Para executar:
```
cd backend
npm run test
```

Os testes cobrem basicamente:
- Criação de tarefa;
- Validação de título obrigatório;
- Listagem de Tarefas;
- Busca por Título;
- Busca por Descrição;
- Filtro por Status
- Edição de Tarefa;
- Alteração de Status;
- Regra de Tarefa Atrasada;
- Comportamento de tarefa concluída com data vencida;
- Resposta pra tarefa inexistente.

## Segurança:
Não foi explicitamente solicitado no documento descritivo do desafio, porém, tomei a liberdade de aplicar alguns conceitos:

- Uso de Helmet para headers HTTP de segurança;
- CORS configurado por variável de ambiente;
- Rate limit para reduzir abuso de requisições;
- Limite de tamanho do JSON recebido pela API;
- Validação de entrada com Zod;
- Tratamento centralizado de erros;
- Respostas sem vazamento de stack trace;
- Uso de Prisma ORM para acesso seguro ao banco;
- Variáveis sensíveis fora do versionamento por meio de .env.

## Decisões Técnicas:
### Node.js com TypeScript no back-end

Embora o desafio tenha sugerido Java 8+ (cujo qual também tenho experiência por ter vivenciado academicamente e em estágio não obrigatório) com Spring Boot ou stack equivalente, optei por utilizar Node.js com TypeScript por ser uma stack moderna, tipada, produtiva pra construir uma API REST simples e organizada. Além do fato de também estar praticando, pois estou com o desenvolvimento de um aplicativo atualmente, como um projeto pessoal.

A escola também permite manter TypeScript tanto no frontend quanto no backend, reduzindo as inconsistências que possam surgir entre as camadas, facilitando a manutenção da solução como um todo.

A API foi organizada em camadas, separando rotas, controllers, services, repositories, schemas, middlewares e configs.

### SQLite

O SQLite foi escolhido por ser simples, leve e suficiente pra o escopo definido no desafio. Ele facilita a execução local e via Docker, sem exigir uma configuração de um banco externo.

Em um ambiente de produção real, uma alternativa mais robusta seria PostgreSQL.

### React com Vite
O frontend foi desenvolvido com React, TypeScript e Vite por permitir uma interface funcional, rápida e simples de avaliar.

A interface consome a API real, sem dados mockados.

## Limitações:

- No momento, a aplicação não tem um sistema de autenticação de usuários
- O campo responsável é textual e não está vinculado a uma tabela de usuários
- Não há paginação na listagem de tarefas
- A busca é simples e baseada em título/descrição
- O projeto não possui deploy público
- O frontend usa CSS puro, sem biblioteca de componentes

## Próximos Passos:
Algumas possíveis melhorias podem ser:

- Adicionar autenticação e autorização;
- Cadastrar responsáveis como usuários;
- Adicionar paginação;
- Adicionar ordenação;
- Adicionar histórico de alterações de status;
- Adicionar confirmação visual com toast;
- Melhorar cobertura de testes no front-end;
- Configurar pipeline de CI;
- Realizar deploy da aplicação.

## Uso de IA no desenvolvimento

Utilizei IA como apoio durante o desenvolvimento para:
- Organizar o planejamento inicial da solução;
- Revisar decisões e validação de stacks;
- Estruturar o README;
- Sugerir boas práticas de validação, segurança e testes;
- Apoiar na investigação de erros de configuração durante o desenvolvimento.

Todas as decisões técnicas foram revisadas manualmente, e o código foi, por várias vezes, ajustado, executado e testado durante o desenvolvimento.