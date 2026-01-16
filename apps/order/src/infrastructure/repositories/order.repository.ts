import { Injectable } from '@nestjs/common';
import { OrderRepository as DomainOrderRepository } from '../../domain/repositories/order.repository';
import { EventStore } from '../event-store/event-store';
import { Order, OrderEvents } from '../../domain/models/order';
import { OrderEventsDataMapper } from '../data-mappers/order-events.data-mapper';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderSnapshotStore } from '../snapshot-store/order.snapshot-store';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class OrderRepository implements DomainOrderRepository {
  constructor(
    private readonly eventStore: EventStore,
    private readonly orderEventsDataMapper: OrderEventsDataMapper,
    private readonly orderSnapshotStore: OrderSnapshotStore,
    private readonly eventBus: EventBus,
  ) {}

  async save(order: Order): Promise<Order> {
    await this.eventStore.save(
      order.id.toString(),
      order
        .getUncommittedEvents()
        .map((event) =>
          this.orderEventsDataMapper.toPersistence(event as OrderEvents),
        ),
      (order.version ?? 0) - order.getUncommittedEvents().length,
    );

    this.eventBus.publishAll(order.getUncommittedEvents());
    order.uncommit();

    // Save a snapshot every 10 events.
    if (order.version % 10 === 0) {
      await this.orderSnapshotStore.save(
        order.id.toString(),
        order,
        order.version,
      );
    }
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const snapshot = await this.orderSnapshotStore.get(id, Order.name);
    let fromVersion = 0;

    let order: Order | null = null;
    if (snapshot) {
      order = snapshot.data;
      fromVersion = snapshot.version;
    }

    // Load events since snapshot (or from beginning if no snapshot)
    const events = await this.eventStore.get(id, fromVersion);
    if (events.length === 0) return null;

    if (order === null) {
      // Get the first event to reconstitue the order.
      // In this case, the first event is the OrderPlacedEvent.
      const orderPlacedEvent = events.find(
        (event) => event.version === 0 && event.type === OrderPlacedEvent.name,
      );
      if (!orderPlacedEvent) return null;

      const { orderId, ...orderProps } = this.orderEventsDataMapper.toDomain(
        orderPlacedEvent,
      ) as OrderPlacedEvent;
      order = Order.create({ ...orderProps }, orderId);
    }

    // Load the order from the events
    order.loadFromHistory(
      events.map((event) => this.orderEventsDataMapper.toDomain(event)),
    );
    return order;
  }
}
