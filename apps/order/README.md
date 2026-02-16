# Order service

## Description

A service that exposes a REST API for managing orders. The **Order** aggregate is implemented using **event sourcing**: all state changes are stored as an append-only stream of domain events, and the current state is derived by replaying those events (or by loading from snapshots for performance).

---

## Event sourcing in this service

Event sourcing is applied end-to-end in the Order bounded context: from the domain model, through persistence, to the read model.

### 1. Event-sourced aggregate root

The **Order** aggregate extends the event-sourcing `AggregateRoot` from `@ecore/domain` (not the simple event-raising base). As a result:

- **Every state change is expressed as a domain event** and applied via `apply(event)`. The base calls `when(event)` so the aggregate updates its internal state only in response to events.
- **State is rebuilt from events** using `loadFromHistory(events)`, which replays events in order and invokes `when(event)` for each one. There is no separate “current state” table for the aggregate; state is derived from the event stream.

**Domain events:**

| Event                 | When it is applied                |
| --------------------- | --------------------------------- |
| `OrderPlacedEvent`    | Order is created (initial state). |
| `OrderConfirmedEvent` | Order is confirmed.               |
| `OrderCancelledEvent` | Order is cancelled.               |

The **`when(event)`** method in `Order` is a single switch on `event.type` and updates `this.props` (status, dates, totals, items, etc.) according to the event. No business logic runs outside of “apply event → when(event).”

### 2. Event store

All order events are persisted in an **event store** (MongoDB, via Mongoose):

- **Stream per aggregate:** Each order has a stream identified by the order ID (`streamName = order.id`).
- **Append-only:** New events are appended with strictly increasing **version** numbers.
- **Optimistic concurrency:** On save, the repository passes `expectedVersion` (current stream length before appending). If the stored version does not match (e.g. another request wrote in between), the store throws and the operation fails, avoiding lost updates.
- **Retrieval:** `EventStore.get(streamName, fromVersion)` returns all events for that order from a given version (or from the start), sorted by version, so they can be replayed in order.

The repository maps domain events to persistence DTOs (and back) via `OrderEventsDataMapper`; the event store deals with serialized event records (e.g. `id`, `occurredAt`, `type`, `version`, `data`, `correlationId`, `causationId`).

### 3. Snapshot store (performance)

To avoid replaying the full event stream on every load:

- **Snapshots** store the reconstructed `Order` aggregate (and its version) at a point in time. The implementation uses MongoDB and the same `OrderDataMapper` used for the read model to serialize/deserialize the aggregate.
- The **Order repository** saves a snapshot **every 10 events** (when `order.version % 10 === 0`) after appending new events.
- On **`findById`**, the repository first tries to load the latest snapshot. It then loads only **events after that snapshot’s version** from the event store and calls `order.loadFromHistory(events)`. If there is no snapshot, it loads all events from the store; if there are no events at all, it returns `null`.

So: **event store = source of truth**; **snapshots = cache** to reduce replay length.

### 4. Repository flow (save vs load)

**Save (e.g. after Place / Confirm / Cancel):**

1. Map the aggregate’s **uncommitted events** to persistence form.
2. Append them to the **event store** with the correct `expectedVersion`.
3. Publish those events to the **event bus** (for subscribers and cross-context integration).
4. Call **`order.uncommit()`** to clear uncommitted events.
5. If `order.version % 10 === 0`, **save a snapshot** for this order and version.

**Load (`findById`):**

1. Optionally load the latest **snapshot** for this order ID and `Order` type.
2. Load **events** from the event store (from `snapshot.version + 1`, or from 0 if no snapshot).
3. If there are no events, return `null`.
4. If there was no snapshot, **reconstitute** the aggregate from the first event (expected to be `OrderPlacedEvent`) using `Order.create(...)`.
5. Call **`order.loadFromHistory(events)`** so the aggregate applies all events (or only the new ones when a snapshot was used).
6. Return the reconstructed **Order**.

### 5. Projections (read model)

The **write model** is the event stream (and optionally snapshots). The **read model** is a separate, query-friendly store (Prisma-backed) used for “get order by ID” and similar queries.

- **OrderProjectionRebuilder** implements `ProjectionRebuilder`: it subscribes to **Order** domain events (via the event bus).
- On each event (e.g. `OrderPlacedEvent`, `OrderConfirmedEvent`, `OrderCancelledEvent`), it either creates an `Order` from the first event or loads the existing projection and calls **`order.loadFromHistory([event])`** to update state, then **upserts** the result into the projection store (Prisma). So the read model is a **projection** of the event stream.
- This keeps queries simple and fast while the event store remains the single source of truth for the aggregate’s history.

### 6. End-to-end flow (summary)

```
Command (e.g. PlaceOrder)
  → Handler loads Order (from snapshot + event store or from event stream)
  → Handler calls domain method (e.g. order.place(...))
  → Order.apply(OrderPlacedEvent) → when(OrderPlacedEvent) updates state
  → Repository.save(order)
      → Event store.append(uncommitted events) with expectedVersion
      → Event bus.publish(uncommitted events)
      → order.uncommit()
      → Optionally snapshot store.save(order, version)
  → Subscribers (e.g. OrderProjectionRebuilder) receive events
      → Rebuild Order from event(s) and upsert into read model
```

So in this service, **event sourcing** means: **events are the source of truth**, **aggregate state is derived by replay (and optionally snapshots)**, **concurrency is handled by version checking in the event store**, and **read models are maintained by reacting to those same events**.

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
