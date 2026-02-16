# E-commerce Core

A **demo app** that illustrates **Domain Driven Design (DDD)**—both strategic and tactical—and **Clean Architecture** throughout a [monorepo](https://www.atlassian.com/git/tutorials/monorepos) with microservice-style bounded contexts. It is **not** a comprehensive, production-ready e-commerce platform; it focuses on structure, patterns, and clarity. The codebase follows Clean Architecture in every app (domain → application → infrastructure, dependency rule, application proxy). E-commerce is used as the domain because it is one of the best examples for an enterprise project: rich aggregates, clear bounded contexts (customer, order, etc.), event-driven integration, and real-world complexity without overwhelming scope.

## What's inside?

This monorepo includes the following packages/apps:

```
.
├── apps
│   ├── customer                  # Customer bounded context — accounts, credit, identity
│   └── order                     # Order bounded context — orders, event sourcing
└── packages
    ├── @ecore/domain              # Shared DDD tactical building blocks
    ├── @ecore/event-bus           # Domain event bus
    ├── @ecore/event-publisher     # Event publishing (e.g. to message broker)
    ├── @ecore/eslint-config       # ESLint configurations (includes Prettier)
    ├── @ecore/jest-config         # Jest configurations
    ├── @ecore/logger              # Logging
    ├── @ecore/typescript-config   # tsconfig.json used across the monorepo
    └── @ecore/exception-filters   # Shared NestJS exception handling
```

- **[Customer](apps/customer/README.md)** — Clean Architecture, application proxy, CQRS.
- **[Order](apps/order/README.md)** — Event sourcing, event store, snapshots, projections.

Each package and application is 100% [TypeScript](https://www.typescriptlang.org/) safe.

---

## Why a monorepo (Turborepo) for microservice-style backends?

Using a monorepo with [Turborepo](https://turborepo.com) for a microservice-style backend brings several benefits that align well with DDD and Clean Architecture:

- **Shared code without publishing** — Common domain primitives (`@ecore/domain`), event bus, logger, and config live in `packages/` and are consumed via `workspace:*`. Every app stays on the same version; there are no separate npm packages to version and publish. Refactors to shared code are reflected across all services in one commit.

- **Atomic changes across services** — When a domain event shape or shared interface changes, you can update the producer app, the consumer app, and the shared package in a single pull request. No “release library first, then update consumers” dance. This reduces integration bugs and makes cross-context evolution easier.

- **Consistent tooling and scripts** — ESLint, TypeScript, Jest, and Prettier are shared. You run `pnpm run build`, `pnpm run test`, or `pnpm run lint` from the root and Turborepo runs the right tasks for each app and package, with caching so only what changed is rebuilt or retested.

- **Single clone, one CI pipeline** — Developers clone one repo and have every service and shared package. CI can run tests and builds for the whole workspace, with dependency-aware task ordering (e.g. build `@ecore/domain` before building apps that depend on it). No need to coordinate multiple repos or duplicate CI configs.

- **Clear boundaries without separate repos** — Each app under `apps/` is still a bounded context (a logical “microservice”). You get clear service boundaries and the option to deploy or scale services independently later, without the overhead of many repositories and duplicated tooling.

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

Each app owns its **domain model**, **domain events**, and **application use cases**. There is no shared “god” domain; only shared **tactical** primitives live in `@ecore/domain`.

#### Ubiquitous language

Domain terms are reflected in code and APIs:

- **Customer context:** `Customer`, `User`, `CreditLimit`, `CreditPurchase`, `CustomerCreated`, `CreditPurchaseApproved` / `CreditPurchaseRejected`
- **Order context:** `Order`, `OrderItem`, `PlaceOrder`, `ConfirmOrder`, `CancelOrder`, `OrderPlaced`, `OrderConfirmed`, `OrderCancelled`, `OrderStatus`

Commands, events, and aggregates are named after this language (e.g. `CreateCustomerCommand`, `OrderPlacedEvent`, `Customer`, `Order`).

#### Context map (cross-context integration)

Contexts integrate in an **event-driven** way:

- **Order → Customer (downstream):** When an order is placed, the **Order** context publishes `OrderPlacedEvent` (e.g. via a message broker). The **Customer** context subscribes (`@EventPattern('OrderPlacedEvent')`) and runs a **Credit Purchase** use case: load customer, check credit limit, and emit `CreditPurchaseApprovedEvent` or `CreditPurchaseRejectedEvent`.

So the relationship is: **Order** (producer) → **Customer** (consumer), using **asynchronous messaging** and **published domain events** as the contract. Each context stays in charge of its own model and does not depend on the other’s internals.

---

### Tactical DDD

Tactical DDD is implemented with **entities**, **value objects**, **aggregate roots**, **domain events**, **repositories**, and a clear **layered structure**. Shared building blocks live in `@ecore/domain`; each app uses them and adds its own domain types.

#### Shared building blocks (`@ecore/domain`)

- **Entity** — Identity and equality by `UniqueIdentifier`; base for aggregates and entities.
- **ValueObject** — Immutable, equality by structural comparison (e.g. `Money`, `EmailAddress`, `Address`, `Password`, `IpAddress`).
- **AggregateRoot** — Base: raises domain events via `apply()`, exposes `getUncommittedEvents()` / `uncommit()`.
- **Event-sourcing AggregateRoot** — Extends base; adds `when(event)` and `loadFromHistory(events)` for rebuilding state from events.
- **DomainEvent** — Base for all domain events (e.g. `id`, `occurredAt`, `type`, `version`, `correlationId`, `causationId`).
- **Repository** — Interface: `findById(id)`, `save(entity)`.
- **CQRS** — `Command` / `CommandHandler`, `Query` / `QueryHandler`; application layer is command/query driven.

#### Per-app tactical patterns

**Customer context**

- **Aggregate root:** `Customer` (extends base `AggregateRoot`). Encapsulates creation and `creditPurchase(orderId, amount)`; applies `CustomerCreatedEvent`, `CreditPurchaseApprovedEvent`, or `CreditPurchaseRejectedEvent`.
- **Entities:** `User` (identity, password, IP, login behavior).
- **Value objects:** Uses shared `Money`, `EmailAddress`, `Address`, `Password`, `IpAddress`.
- **Repository:** `CustomerRepository` (interface in domain, implementation in infrastructure; e.g. Prisma).
- **Application layer:** Commands: `CreateCustomer`, `CreditPurchase`; Queries: `GetCustomer`. Handlers load aggregates, call domain methods, and persist via repositories.

**Order context**

- **Aggregate root:** `Order` (extends **event-sourcing** `AggregateRoot`). State changes (place, confirm, cancel) are expressed as domain events; `when(event)` updates internal state; `loadFromHistory(events)` reconstructs the aggregate.
- **Entity (inside aggregate):** `OrderItem` (product, quantity, unit price; extends `Entity`).
- **Value objects:** Shared `Money` for amounts and prices.
- **Domain events:** `OrderPlacedEvent`, `OrderConfirmedEvent`, `OrderCancelledEvent` — stored in an **event store** and used for rebuilding state and projections.
- **Repository:** `OrderRepository` (interface in domain). Implementation loads/saves via **event store** and optional **snapshot store**; can rebuild `Order` from event stream.
- **Projections:** Order read model is updated by **projection rebuilder** subscribers that react to order events (e.g. for queries).
- **Application layer:** Commands: `PlaceOrder`, `ConfirmOrder`, `CancelOrder`; Queries: `GetOrder`. Handlers work with the Order aggregate and repository (event-sourced).

#### Layered structure (per app)

Each app follows a **domain → application → infrastructure** layout:

- **Domain:** Aggregates, entities, value objects, domain events, **repository interfaces** (no infrastructure).
- **Application:** Commands, queries, DTOs, **command/query handlers** that orchestrate domain and repositories.
- **Infrastructure:** Controllers (HTTP + event handlers), persistence (Prisma / MongoDB for events/snapshots), **repository implementations**, **data mappers** (persistence ↔ domain), **presenters** (domain → API DTOs), and **event subscribers** (e.g. projection rebuilders, outgoing event publishing).

This keeps domain and application free of HTTP, databases, and messaging details; infrastructure “adapts” the outside world to the domain.

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

## Utilities and tooling

This monorepo is built with [Turborepo](https://turborepo.com) and uses:

- [NestJS](https://nestjs.com) — server-side application framework
- [TypeScript](https://www.typescriptlang.org/) — static type safety
- [ESLint](https://eslint.org/) — linting
- [Prettier](https://prettier.io) — formatting
- [Jest](https://jestjs.io) — testing

## Useful links

Thanks to the following:

- [khalilstemmler](https://khalilstemmler.com/articles/categories/domain-driven-design/) - DDD concepts in TypeScript
- [yerinadler](https://github.com/yerinadler/typescript-ddd-sample-app) - Sample DDD GitHub project
- [@bhargavkoya56](https://medium.com/@bhargavkoya56/mastering-cqrs-and-event-sourcing-in-net-74248fc01b93) - CQRS and Event Sourcing implementation
