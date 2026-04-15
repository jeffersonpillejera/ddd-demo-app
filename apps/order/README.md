# Order service

## Description

A NestJS service that exposes a REST API for managing orders. The **Order** aggregate is implemented using **event sourcing**: all state changes are stored as an append-only stream of domain events, and the current state is derived by replaying those events (or by loading from snapshots for performance). The read model is maintained separately via projections.

---

## HTTP API

| Method  | Path                | Description              |
| ------- | ------------------- | ------------------------ |
| `POST`  | `/order/place`      | Place a new order        |
| `GET`   | `/order/:id`        | Retrieve an order by ID  |
| `PATCH` | `/order/cancel/:id` | Cancel an existing order |

### Event patterns (via Redis)

| Pattern                       | Action                               |
| ----------------------------- | ------------------------------------ |
| `CreditPurchaseApprovedEvent` | Triggers the `ConfirmOrder` use case |
| `CreditPurchaseRejectedEvent` | Triggers the `CancelOrder` use case  |

---

## Environment variables

| Variable                        | Required | Description                                 |
| ------------------------------- | -------- | ------------------------------------------- |
| `DATABASE_PROJECTION_STORE_URL` | Yes      | PostgreSQL connection string for read model |
| `DATABASE_EVENT_STORE_URL`      | Yes      | MongoDB connection string for event store   |
| `REDIS_HOST`                    | Yes      | Redis hostname                              |
| `REDIS_PORT`                    | Yes      | Redis port                                  |
| `PORT`                          | No       | HTTP port                                   |
| `ALLOWED_ORIGINS`               | No       | CORS allowed origins                        |
| `NODE_ENV`                      | No       | `development` \| `production`               |

The order service uses **two separate databases**: MongoDB for the event store (source of truth) and PostgreSQL for the projection/read model.

---

## Event sourcing in this service

Event sourcing is applied end-to-end in the Order bounded context: from the domain model, through persistence, to the read model.

### 1. Event-sourced aggregate root

The **Order** aggregate extends the event-sourcing `AggregateRoot` from `@ecore/core`:

- **Every state change is expressed as a domain event** and applied via `apply(event)`. The base calls `when(event)` so the aggregate updates its internal state only in response to events.
- **State is rebuilt from events** using `loadFromHistory(events)`, which replays events in order and invokes `when(event)` for each one. There is no separate "current state" table for the aggregate; state is derived from the event stream.

**Domain events:**

| Event                 | When it is applied                |
| --------------------- | --------------------------------- |
| `OrderPlacedEvent`    | Order is created (initial state). |
| `OrderConfirmedEvent` | Order is confirmed.               |
| `OrderCancelledEvent` | Order is cancelled.               |

The **`when(event)`** method in `Order` switches on `event.type` and updates `this.props` (status, dates, totals, items, etc.) according to the event. No business logic runs outside of "apply event → when(event)."

### 2. Event store

All order events are persisted in an **event store** (MongoDB, via Mongoose):

- **Stream per aggregate:** Each order has a stream identified by the order ID (`streamName = order.id`).
- **Append-only:** New events are appended with strictly increasing **version** numbers.
- **Optimistic concurrency:** On save, the repository passes `expectedVersion` (current stream length before appending). If the stored version does not match (e.g. a concurrent write), the store throws and the operation fails, preventing lost updates.
- **Retrieval:** `EventStore.get(streamName, fromVersion)` returns all events for that order from a given version (or from the start), sorted by version.

The repository maps domain events to persistence DTOs (and back) via `OrderEventsDataMapper`; the event store deals with serialized event records (`id`, `occurredAt`, `type`, `version`, `data`, `correlationId`, `causationId`).

### 3. Snapshot store (performance)

To avoid replaying the full event stream on every load:

- **Snapshots** store the reconstructed `Order` aggregate (and its version) at a point in time, using MongoDB.
- The **Order repository** saves a snapshot **every 10 events** (`order.version % 10 === 0`) after appending new events.
- On **`findById`**, the repository first loads the latest snapshot, then loads only **events after that snapshot's version** from the event store and calls `order.loadFromHistory(events)`. If there is no snapshot, it loads all events from the start.

> **Event store = source of truth; snapshots = cache to reduce replay length.**

### 4. Repository flow

**Save (e.g. after Place / Confirm / Cancel):**

1. Map the aggregate's **uncommitted events** → persistence form.
2. Append to the **event store** with `expectedVersion`.
3. Publish events to the **event bus** (for subscribers and cross-context integration).
4. Call `order.uncommit()` to clear uncommitted events.
5. If `order.version % 10 === 0`, save a **snapshot**.

**Load (`findById`):**

1. Load the latest **snapshot** for this order (if any).
2. Load **events** from the event store (from `snapshot.version + 1`, or from 0 if no snapshot).
3. If there are no events, return `null`.
4. If there was no snapshot, reconstitute the aggregate from the first event (`OrderPlacedEvent`) using `Order.create(...)`.
5. Call `order.loadFromHistory(events)` to apply remaining events.
6. Return the reconstructed **Order**.

### 5. Projections (read model)

- **Write model:** Event stream + optional snapshots (MongoDB).
- **Read model:** Separate query-friendly store (Prisma/PostgreSQL) used for `GetOrder` queries.
- **OrderProjectionRebuilder** subscribes to Order domain events via the event bus and upserts the read model on each event (`OrderPlacedEvent`, `OrderConfirmedEvent`, `OrderCancelledEvent`).
- This keeps queries simple and fast while the event store remains the single source of truth for the aggregate's history.

### 6. End-to-end flow (summary)

```
Command (e.g. PlaceOrder)
  → Handler loads Order (from snapshot + event store, or full replay)
  → Handler calls domain method (order.place(...))
  → Order.apply(OrderPlacedEvent) → when(OrderPlacedEvent) updates state
  → Repository.save(order)
      → Event store.append(uncommitted events) with expectedVersion
      → Event bus.publish(uncommitted events)
      → order.uncommit()
      → Optionally: snapshot store.save(order, version)
  → Subscribers (OrderProjectionRebuilder) receive events
      → Rebuild Order from event(s) and upsert into read model (Prisma)
```

In this service, **event sourcing** means: **events are the source of truth**, **aggregate state is derived by replay** (and optionally snapshots), **concurrency is handled by version checking in the event store**, and **read models are maintained by reacting to those same events**.

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

## Run tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```
