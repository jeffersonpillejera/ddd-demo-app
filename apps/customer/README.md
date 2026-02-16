# Customer service

## Description

A service that exposes a REST API for managing user and customer accounts. The codebase follows **Clean Architecture** strictly: the Domain and Application layers have no dependency on frameworks or infrastructure. The **application proxy** is the bridge that connects the Application layer to the Infrastructure layer (NestJS, HTTP, persistence) without inverting the dependency rule.

---

## Clean Architecture in this service

Dependencies point **inward**: Infrastructure → Application → Domain. The Domain has no dependencies on the outside; the Application layer depends only on domain abstractions (interfaces); the Infrastructure layer implements those abstractions and drives the application via the **application proxy**.

### Layer overview

| Layer              | Location              | Responsibility                                                                                                              | Dependencies                                                                          |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Domain**         | `src/domain/`         | Entities (Customer, User), value objects, domain events, **repository interfaces**                                          | None (only `@ecore/domain` core types)                                                |
| **Application**    | `src/application/`    | Use cases: Commands, Queries, DTOs, **handlers** that orchestrate domain and repositories                                   | Domain interfaces only (Repository, Presenter, ILogger, CommandHandler, QueryHandler) |
| **Infrastructure** | `src/infrastructure/` | Controllers (HTTP, event patterns), **application proxy**, repository implementations, presenters, persistence, subscribers | Application + Domain (and NestJS, Prisma, etc.)                                       |

The Application layer does **not** import NestJS, Prisma, or any HTTP/transport. It only knows about commands, queries, domain models, and interfaces such as `CustomerRepository`, `Presenter<Customer, CustomerDTO>`, and `ILogger`. All framework and I/O concerns live in Infrastructure.

---

## Application proxy: connecting Application and Infrastructure

The **application proxy** is the adapter that allows the **Infrastructure** layer to run **Application** use cases without the Application layer depending on the framework. It sits in `src/infrastructure/application-proxy/`.

### Why a proxy?

- The **Application** layer defines **handlers** that implement **domain** CQRS contracts (`CommandHandler<T>`, `QueryHandler<T, R>` from `@ecore/domain`). These handlers depend on **abstractions** (e.g. `CustomerRepository`, `Presenter<Customer, CustomerDTO>`, `ILogger`). They are plain TypeScript classes with no NestJS decorators.
- The **Infrastructure** layer uses **NestJS CQRS**: controllers call `CommandBus.execute(command)` and `QueryBus.execute(query)`. The bus needs **NestJS-registered** handlers (classes decorated with `@CommandHandler(Command)` / `@QueryHandler(Query)` that implement `ICommandHandler` / `IQueryHandler`).
- So we need a component that:
  1. Is part of **Infrastructure** (knows NestJS).
  2. Registers with the CQRS bus so it receives commands/queries.
  3. Delegates to the **Application** handler and **injects** concrete implementations of the abstractions the handler expects.

That component is the **application proxy**.

### How it is implemented

For each use case there is a **proxy class** in Infrastructure that:

1. **Extends** the corresponding Application handler (e.g. `CreateCustomerHandler`, `CreditPurchaseHandler`, `GetCustomerHandler`).
2. **Implements** NestJS’s handler interface (`ICommandHandler<CreateCustomerCommand>` or `IQueryHandler<GetCustomerQuery, CustomerDTO>`) so the CQRS bus can route to it.
3. Is **decorated** with `@CommandHandler(CreateCustomerCommand)` or `@QueryHandler(GetCustomerQuery)` so Nest discovers it.
4. In the **constructor**, receives **concrete** Infrastructure dependencies (e.g. `CustomerRepository` from `infrastructure/repositories`, `LoggerService`, `CustomerPresenter`) and passes them to `super(...)`, satisfying the Application handler’s dependencies.
5. In **`execute(command)` or `execute(query)`**, delegates to `super.execute(command)` or `super.execute(query)` so the real logic runs in the Application layer.

Example (conceptually):

```text
Controller (Infrastructure)
  → commandBus.execute(new CreateCustomerCommand(...))
  → Nest routes to CreateCustomerProxy (registered @CommandHandler)
  → CreateCustomerProxy.execute(command) → super.execute(command)
  → CreateCustomerHandler (Application) runs with CustomerRepository, ILogger
      → repository and logger are the concrete implementations injected by the proxy
```

So:

- **Controllers** only use `CommandBus` / `QueryBus` and application DTOs/commands/queries. They never depend on handler or repository classes directly.
- **Application handlers** never import NestJS or Infrastructure; they only depend on domain interfaces.
- **Proxies** are the only place that “wires” framework (Nest CQRS) to application use cases and injects infrastructure implementations into the application layer at runtime.

### Proxy modules and registration

- **ApplicationProxyModule** (in `infrastructure/application-proxy/`) imports RepositoriesModule, PresentersModule, and LoggerModule, and declares the proxy providers: `CreateCustomerProxy`, `CreditPurchaseProxy`, `GetCustomerProxy`. These are the classes that Nest’s `CqrsModule` discovers as command/query handlers.
- **ControllersModule** imports **ApplicationProxyModule** (so the proxies are registered in the same app) and declares the controllers. Controllers use the buses; the buses dispatch to the proxies; the proxies delegate to the application handlers.

So the flow is strictly: **Controller → Bus → Proxy (Infrastructure) → Application Handler → Domain**. The Application layer is never coupled to HTTP, Nest, or the database; the proxy is the single connection point between the framework and the use cases.

---

## Dependency rule in practice

- **Domain** defines `CustomerRepository` (interface), `Presenter`, and CQRS handler interfaces. It does not know who implements them.
- **Application** implements use cases by depending on `CustomerRepository`, `Presenter<Customer, CustomerDTO>`, and `ILogger` (all interfaces/abstractions). It does not import anything from `infrastructure/`.
- **Infrastructure** implements `CustomerRepository` (e.g. Prisma-backed), `CustomerPresenter` (domain → API DTO), and provides the **application proxy** that extends the application handlers and injects these implementations. Controllers and event handlers live here and use the buses only.

Thus: **Infrastructure → Application → Domain**; Application and Domain remain framework-agnostic and testable in isolation. The application proxy is what makes this possible while still using NestJS CQRS and the rest of the infrastructure stack.

---

## Project setup

```bash
# install all dependencies
$ pnpm install
```

## Compile and run the project

```bash
# development watch mode
$ pnpm run dev

# debug mode
$ pnpm run start:debug

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
