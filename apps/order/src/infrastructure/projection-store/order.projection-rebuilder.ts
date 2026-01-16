import { ProjectionRebuilder } from '@ecore/domain/core/event-sourcing/projection-rebuilder';
import { ProjectionStoreService } from './projection-store.service';
import { Injectable } from '@nestjs/common';
import { OrderDataMapper } from '../data-mappers/order.data-mapper';
import { EventStore } from '../event-store/event-store';
import { Order } from '../../domain/models/order';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderEvents } from '../../domain/models/order';

@Injectable()
export class OrderProjectionRebuilder implements ProjectionRebuilder {
  constructor(
    private readonly projectionStoreService: ProjectionStoreService,
    private readonly orderMapper: OrderDataMapper,
    private readonly eventStore: EventStore,
  ) {}

  async rebuild<T extends OrderEvents>(event: T): Promise<void> {
    let orderDomain: Order | null = null;
    const existingOrder = await this.projectionStoreService.order.findUnique({
      where: { id: event.orderId.toString() },
      include: { items: true },
    });

    if (!existingOrder) {
      // create order domain from OrderPlacedEvent
      const { orderId, ...orderProps } = event as OrderPlacedEvent;

      orderDomain = Order.create({ ...orderProps }, orderId);
    } else {
      orderDomain = this.orderMapper.toDomain(existingOrder);
      orderDomain.loadFromHistory([event]);
    }

    const { items, ...order } = this.orderMapper.toPersistence(orderDomain);
    await this.projectionStoreService.order.upsert({
      where: { id: order.id },
      create: { ...order, items: { create: items } },
      update: {
        ...order,
        items: {
          upsert: items.map((item) => ({
            where: { id: item.id },
            create: item,
            update: item,
          })),
        },
      },
    });
  }

  rebuildAll(): Promise<void> {
    return Promise.resolve();
  }
}
