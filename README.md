# E-commerce Core

A **demo app** that illustrates **Domain Driven Design (DDD)**—both strategic and tactical—and **Clean Architecture** throughout a [monorepo](https://www.atlassian.com/git/tutorials/monorepos) with microservice-style bounded contexts. It is **not** a comprehensive, production-ready e-commerce platform; it focuses on structure, patterns, and clarity. The codebase follows Clean Architecture in every app (domain → application → infrastructure, dependency rule). E-commerce is used as the domain because it is one of the best examples for an enterprise project: rich aggregates, clear bounded contexts (customer, order, etc.), event-driven integration, and real-world complexity without overwhelming scope.

## What's inside?

This monorepo includes the following packages/apps:

```
.
├── apps
│   ├── customer                  # Customer bounded context — accounts, credit, identity
│   └── order                     # Order bounded context — orders, event sourcing
└── packages
    ├── @ecore/core               # DDD building blocks: entities, aggregates, value objects, event sourcing
    ├── @ecore/common             # Shared DTOs, interfaces, and Swagger utilities
    ├── @ecore/event-publisher    # Event publishing to Redis
    ├── @ecore/http               # HTTP client utilities (Axios integration)
    ├── @ecore/logger             # Logging
    ├── @ecore/utils              # General utility functions
    ├── @ecore/exception-filters  # Shared NestJS exception handling
    ├── @ecore/eslint-config      # ESLint + Prettier configurations
    ├── @ecore/jest-config        # Jest configurations
    └── @ecore/typescript-config  # tsconfig.json used across the monorepo
```

- **[Customer](apps/customer/README.md)** — Clean Architecture, NestJS CQRS, Prisma.
- **[Order](apps/order/README.md)** — Event sourcing, event store, snapshots, projections.

Each package and application is 100% [TypeScript](https://www.typescriptlang.org/) safe.

---

## Why a monorepo (Turborepo) for microservice-style backends?

Using a monorepo with [Turborepo](https://turborepo.com) for a microservice-style backend brings several benefits that align well with DDD and Clean Architecture:

- **Shared code without publishing** — Common domain primitives (`@ecore/core`), event bus, logger, and config live in `packages/` and are consumed via `workspace:*`. Every app stays on the same version; there are no separate npm packages to version and publish. Refactors to shared code are reflected across all services in one commit.

- **Atomic changes across services** — When a domain event shape or shared interface changes, you can update the producer app, the consumer app, and the shared package in a single pull request. No "release library first, then update consumers" dance. This reduces integration bugs and makes cross-context evolution easier.

- **Consistent tooling and scripts** — ESLint, TypeScript, Jest, and Prettier are shared (all configs use ESM `.mjs` format). You run `pnpm run build`, `pnpm run test`, or `pnpm run lint` from the root and Turborepo runs the right tasks for each app and package, with caching so only what changed is rebuilt or retested.

- **Single clone, one CI pipeline** — Developers clone one repo and have every service and shared package. CI can run tests and builds for the whole workspace, with dependency-aware task ordering (e.g. build `@ecore/core` before building apps that depend on it). No need to coordinate multiple repos or duplicate CI configs.

- **Clear boundaries without separate repos** — Each app under `apps/` is still a bounded context (a logical "microservice"). You get clear service boundaries and the option to deploy or scale services independently later, without the overhead of many repositories and duplicated tooling.

In short: a Turborepo monorepo gives you **shared code, atomic refactors, and one pipeline** while keeping **service boundaries explicit**. That makes it a strong fit for a microservice-style backend where services share domain and infrastructure concepts but remain independently deployable.

---

## Domain Driven Design in This Project

### Strategic DDD

Strategic DDD focuses on **bounded contexts**, **ubiquitous language**, and **context mapping**—how different parts of the business are carved out and how they communicate.

#### Bounded contexts (microservices)

The system is split into **bounded contexts**, each implemented as a NestJS app:

| Bounded context | App             | Responsibility                                                                                                             |
| --------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Customer**    | `apps/customer` | User and customer accounts, identity (User), credit limit, addresses. Reacts to orders to approve/reject credit purchases. |
| **Order**       | `apps/order`    | Order lifecycle: place, confirm, cancel. Uses **event sourcing** for the Order aggregate.                                  |

Each app owns its **domain model**, **domain events**, and **application use cases**. There is no shared "god" domain; only shared **tactical** primitives live in `@ecore/core`.

#### Ubiquitous language

Domain terms are reflected in code and APIs:

- **Customer context:** `Customer`, `User`, `CreditLimit`, `CreditPurchase`, `CustomerCreated`, `CreditPurchaseApproved` / `CreditPurchaseRejected`
- **Order context:** `Order`, `OrderItem`, `PlaceOrder`, `ConfirmOrder`, `CancelOrder`, `OrderPlaced`, `OrderConfirmed`, `OrderCancelled`, `OrderStatus`

Commands, events, and aggregates are named after this language (e.g. `CreateCustomerCommand`, `OrderPlacedEvent`, `Customer`, `Order`).

#### Context map (cross-context integration)

Contexts integrate in an **event-driven** way via Redis:

- **Order → Customer (downstream):** When an order is placed, the **Order** context publishes `OrderPlacedEvent`. The **Customer** context subscribes (`@EventPattern('OrderPlacedEvent')`) and runs a **Credit Purchase** use case: load customer, check credit limit, and emit `CreditPurchaseApprovedEvent` or `CreditPurchaseRejectedEvent`.
- **Customer → Order (downstream):** The **Order** context subscribes to `CreditPurchaseApprovedEvent` (to confirm the order) and `CreditPurchaseRejectedEvent` (to cancel it).

Each context stays in charge of its own model and does not depend on the other's internals. Shared event DTOs live in `@ecore/common`.

---

### Tactical DDD

Tactical DDD is implemented with **entities**, **value objects**, **aggregate roots**, **domain events**, **repositories**, and a clear **layered structure**. Shared building blocks live in `@ecore/core`; each app uses them and adds its own domain types.

#### Shared building blocks (`@ecore/core`)

- **Entity** — Identity and equality by `UniqueIdentifier`; base for aggregates and entities.
- **ValueObject** — Immutable, equality by structural comparison.
- **AggregateRoot** — Base: raises domain events via `apply()`, exposes `getUncommittedEvents()` / `uncommit()`.
- **Event-sourcing AggregateRoot** — Extends base; adds `when(event)` and `loadFromHistory(events)` for rebuilding state from events.
- **DomainEvent** — Base for all domain events (`id`, `occurredAt`, `type`, `version`, `correlationId`, `causationId`).
- **Repository** — Interface: `findById(id)`, `save(entity)`.
- **CQRS** — `Command` / `CommandHandler`, `Query` / `QueryHandler`; application layer is command/query driven.
- **Common exceptions** — `BadRequest`, `NotFound`, `Forbidden`, `Unauthorized`, `Unprocessable`.
- **Common value objects** — `Money`, `EmailAddress`, `Address`, `Password`, `IpAddress` (shared across contexts).
- **Event sourcing** — `EventStore`, `SnapshotStore`, `ProjectionRebuilder` interfaces.

#### Shared DTOs and utilities (`@ecore/common`)

- **Customer DTOs:** `CreditPurchaseApprovedEventDTO`, `CreditPurchaseRejectedEventDTO`
- **Order DTOs:** `OrderPlacedEventDTO`, `OrderItemDTO`
- **Value object DTOs:** `MoneyDTO`, `AddressDTO`, `CreateAddressDTO`
- **Error response DTOs:** `ErrorResponseDto`, `BadRequestResponseDto`, `UnauthorizedResponseDto`, `ForbiddenResponseDto`, `NotFoundResponseDto`
- **Swagger utilities:** `ApiController` decorator, error response swagger decorators, pagination swagger

#### Per-app tactical patterns

**Customer context**

- **Aggregate root:** `Customer` (extends base `AggregateRoot`). Encapsulates creation and `creditPurchase(orderId, amount)`; applies `CustomerCreatedEvent`, `CreditPurchaseApprovedEvent`, or `CreditPurchaseRejectedEvent`.
- **Entities:** `User` (identity, password, IP, login behavior).
- **Value objects:** Uses shared `Money`, `EmailAddress`, `Address`, `Password`, `IpAddress` from `@ecore/core`.
- **Repository:** `CustomerRepository` (interface in domain, Prisma-backed implementation in infrastructure).
- **Application layer:** Commands: `CreateCustomer`, `CreditPurchase`; Queries: `GetCustomer`. Handlers load aggregates, call domain methods, and persist via repositories.

**Order context**

- **Aggregate root:** `Order` (extends **event-sourcing** `AggregateRoot`). State changes (place, confirm, cancel) are expressed as domain events; `when(event)` updates internal state; `loadFromHistory(events)` reconstructs the aggregate.
- **Entity (inside aggregate):** `OrderItem` (product, quantity, unit price).
- **Value objects:** Shared `Money` from `@ecore/core`.
- **Domain events:** `OrderPlacedEvent`, `OrderConfirmedEvent`, `OrderCancelledEvent` — stored in an **event store** and used for rebuilding state and projections.
- **Repository:** `OrderRepository` (interface in domain). Implementation loads/saves via **event store** and optional **snapshot store**.
- **Projections:** Order read model is updated by **projection rebuilder** subscribers that react to order events.
- **Application layer:** Commands: `PlaceOrder`, `ConfirmOrder`, `CancelOrder`; Queries: `GetOrder`.

#### Layered structure (per app)

Each app follows a **domain → application → infrastructure** layout:

- **Domain:** Aggregates, entities, value objects, domain events, **repository interfaces** (no infrastructure).
- **Application:** Commands, queries, DTOs (`dto.interface.ts`), **command/query handlers** that orchestrate domain and repositories.
- **Infrastructure:** Controllers (HTTP + event handlers), **repositories** (persistence implementations), **data mappers** (persistence ↔ domain), **presenters** (domain → API DTOs), **subscribers** (projection rebuilders, event publishing), and **config** (env validation). Application handlers are registered here as NestJS providers and wired to their infrastructure dependencies via injection tokens.

This keeps domain and application free of HTTP, databases, and messaging details; infrastructure "adapts" the outside world to the domain.

#### Summary table

| Tactical element  | Customer context            | Order context                          |
| ----------------- | --------------------------- | -------------------------------------- |
| Aggregate root    | `Customer`                  | `Order` (event-sourced)                |
| Entities          | `User`                      | `OrderItem`                            |
| Value objects     | Money, Email, Address, etc. | Money                                  |
| Domain events     | CustomerCreated, Credit\*   | OrderPlaced, OrderConfirmed, Cancelled |
| Repository        | CustomerRepository          | OrderRepository (event store)          |
| Application style | CQRS (commands/queries)     | CQRS + event sourcing                  |

---

## Running the project

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://www.docker.com/) (optional, for containerized runs)

### Install dependencies

```bash
pnpm install
```

### Development

```bash
# Start all apps in watch mode
pnpm run dev

# Build all packages and apps
pnpm run build

# Run all tests
pnpm run test

# Lint all packages and apps
pnpm run lint
```

### Docker (customer app)

The customer app includes a `Dockerfile` and `docker-compose.yml`:

```bash
cd apps/customer
docker compose up
```

---

## Utilities and tooling

This monorepo is built with [Turborepo](https://turborepo.com) and uses:

- [NestJS](https://nestjs.com) — server-side application framework
- [TypeScript](https://www.typescriptlang.org/) — static type safety
- [ESLint](https://eslint.org/) — linting (flat ESM config via `eslint.config.mjs`)
- [Prettier](https://prettier.io) — formatting (ESM config via `.prettierrc.mjs`)
- [Jest](https://jestjs.io) — testing
- [Prisma](https://www.prisma.io/) — ORM / projection store
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM for the Order event store
- [Redis](https://redis.io/) — message broker for cross-context event publishing

## Useful links

Thanks to the following:

- [khalilstemmler](https://khalilstemmler.com/articles/categories/domain-driven-design/) - DDD concepts in TypeScript
- [yerinadler](https://github.com/yerinadler/typescript-ddd-sample-app) - Sample DDD GitHub project
- [@bhargavkoya56](https://medium.com/@bhargavkoya56/mastering-cqrs-and-event-sourcing-in-net-74248fc01b93) - CQRS and Event Sourcing implementation
