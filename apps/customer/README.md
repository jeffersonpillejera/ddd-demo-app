# Customer service

## Description

A NestJS service that exposes a REST API for managing user and customer accounts. The codebase follows **Clean Architecture** strictly: the Domain and Application layers have no dependency on frameworks or infrastructure. The **Application Layer** is the bridge that connects the Domain to the Infrastructure layer (NestJS, HTTP, Prisma) without violating the dependency rule.

---

## Clean Architecture in this service

Dependencies point **inward**: Infrastructure → Application → Domain. The Domain has no dependencies on the outside; the Application layer depends only on domain abstractions (interfaces); the Infrastructure layer implements those abstractions and drives the application.

### Layer overview

| Layer              | Location              | Responsibility                                                                                               | Dependencies                                                           |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Domain**         | `src/domain/`         | Aggregates (`Customer`, `User`), value objects, domain events, **repository interfaces**                     | None (only `@ecore/core` primitives)                                   |
| **Application**    | `src/application/`    | Commands (`CreateCustomer`, `CreditPurchase`), Queries (`GetCustomer`), **handlers** that orchestrate domain | Domain interfaces only (`ICustomerRepository`, `Presenter`, `ILogger`) |
| **Infrastructure** | `src/infrastructure/` | Controllers, repositories (Prisma), data mappers, presenters, subscribers, event patterns, config            | Application + Domain (and NestJS, Prisma, Redis, etc.)                 |

The Application layer does **not** import Prisma or any HTTP/transport. It only knows about commands, queries, domain models, and interfaces such as `ICustomerRepository`, `Presenter<Customer, ICustomerDTO>`, and `ILogger`. All framework and I/O concerns live in Infrastructure.

---

## CQRS wiring

Application handlers are registered directly as NestJS providers and implement NestJS CQRS interfaces (`ICommandHandler`, `IQueryHandler`) in the application layer. Infrastructure dependencies (repository implementations, presenters, logger) are injected into handlers via NestJS's `@Inject(TOKEN)` using domain-defined injection tokens.

```text
Controller (Infrastructure)
  → commandBus.execute(new CreateCustomerCommand(...))
  → Nest routes to CreateCustomerHandler (@CommandHandler)
  → CreateCustomerHandler runs with ICustomerRepository, ILogger
      → concrete implementations are injected by NestJS DI
```

All handlers are declared as providers in `CustomerModule` alongside their infrastructure dependencies:

```text
CustomerModule
  providers: [
    CustomerDataMapper,
    CustomerRepository,
    { provide: CUSTOMER_REPOSITORY, useExisting: CustomerRepository },
    CreateCustomerHandler,   ← @CommandHandler(CreateCustomerCommand)
    CreditPurchaseHandler,   ← @CommandHandler(CreditPurchaseCommand)
    GetCustomerHandler,      ← @QueryHandler(GetCustomerQuery)
    AllCustomerEventsHandler,
  ]
```

- **Controllers** only use `CommandBus` / `QueryBus`. They never depend on handler or repository classes directly.
- **Application handlers** use NestJS CQRS decorators but do not import Prisma, HTTP, or any infrastructure detail.
- **Dependency injection** wires concrete infrastructure implementations (e.g. `CustomerRepository`, `CustomerPresenter`) to the abstract tokens (`CUSTOMER_REPOSITORY`, `CUSTOMER_PRESENTER`) that handlers depend on.

---

## Infrastructure structure

```
src/infrastructure/
├── config/                   # Env validation, module, service
├── controllers/              # HTTP + event-pattern handlers
├── data-mappers/             # Persistence ↔ domain model mapping
├── persistence/              # Database (Prisma)
├── presenters/               # Domain → API DTO (CustomerPresenter, CustomerEventsPresenter)
├── repositories/             # Prisma-backed CustomerRepository implementation
└── subscribers/              # Domain event subscribers (e.g. outgoing event publishing)
```

---

## HTTP API

| Method | Path            | Description               |
| ------ | --------------- | ------------------------- |
| `POST` | `/customer`     | Create a new customer     |
| `GET`  | `/customer/:id` | Retrieve a customer by ID |

### Event patterns (via Redis)

| Pattern            | Action                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| `OrderPlacedEvent` | Triggers the `CreditPurchase` use case; emits approved or rejected events |

---

## Environment variables

| Variable          | Required | Description                           |
| ----------------- | -------- | ------------------------------------- |
| `DATABASE_URL`    | Yes      | PostgreSQL connection string (Prisma) |
| `REDIS_HOST`      | Yes      | Redis hostname                        |
| `REDIS_PORT`      | Yes      | Redis port                            |
| `PORT`            | No       | HTTP port (default: 3008)             |
| `ALLOWED_ORIGINS` | No       | CORS allowed origins                  |
| `NODE_ENV`        | No       | `development` \| `production`         |

---

## Project setup

```bash
# Install all dependencies from the monorepo root
pnpm install
```

## Compile and run

```bash
# Development (watch mode)
pnpm run dev

# Debug mode
pnpm run start:debug

# Production
pnpm run start:prod
```

## Docker

```bash
# From the apps/customer directory
docker compose up
```

## Run tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```
