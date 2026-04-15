import { DataMapper } from '@ecore/core/data-mapper';
import { OrderEvents } from '../../domain/models/order';
import { Injectable } from '@nestjs/common';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import {
  IOrderCanceledEventDTO,
  IOrderConfirmedEventDTO,
  IOrderPlacedEventDTO,
} from '../../application/dto.interface';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { OrderItem } from '../../domain/models/order-item';
import { EventEntity } from '../event-store/event.schema';

@Injectable()
export class OrderEventsDataMapper extends DataMapper<
  OrderEvents,
  EventEntity
> {
  toDomain(event: EventEntity): OrderEvents {
    const { type, data } = event;
    switch (type) {
      case OrderConfirmedEvent.name: {
        const confirmedEvent = data as unknown as IOrderConfirmedEventDTO;
        return new OrderConfirmedEvent(
          new UniqueIdentifier(confirmedEvent.orderId.toString()),
          confirmedEvent.status,
          confirmedEvent.confirmedAt,
          confirmedEvent.updatedAt,
        );
      }
      case OrderCancelledEvent.name: {
        const canceledEvent = data as unknown as IOrderCanceledEventDTO;
        return new OrderCancelledEvent(
          new UniqueIdentifier(canceledEvent.orderId.toString()),
          canceledEvent.status,
          canceledEvent.cancelledAt,
          canceledEvent.updatedAt,
        );
      }
      case OrderPlacedEvent.name: {
        const placedEvent = data as unknown as IOrderPlacedEventDTO;
        return new OrderPlacedEvent(
          new UniqueIdentifier(placedEvent.orderId.toString()),
          placedEvent.status,
          placedEvent.customerId,
          placedEvent.dateOrdered,
          this.toMoney(placedEvent.discount),
          this.toMoney(placedEvent.totalTax),
          this.toMoney(placedEvent.subTotal),
          this.toMoney(placedEvent.grandTotal),
          placedEvent.items.map((item) =>
            OrderItem.create({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: this.toMoney(item.unitPrice),
            }),
          ),
          placedEvent.createdAt,
        );
      }
      default: {
        throw new Error(`Unknown event type: ${type}`);
      }
    }
  }

  toPersistence(event: OrderEvents): EventEntity {
    const {
      id,
      type,
      occurredAt,
      version,
      correlationId,
      causationId,
      ...domain
    } = event;

    const orderEvent = {
      id,
      type,
      occurredAt,
      version,
      correlationId,
      causationId,
    };

    switch (type) {
      case OrderPlacedEvent.name: {
        const event = domain as OrderPlacedEvent;
        return {
          ...orderEvent,
          streamName: event.orderId.toString(),
          data: {
            orderId: event.orderId.toString(),
            customerId: event.customerId,
            status: event.status,
            dateOrdered: event.dateOrdered,
            discount: event.discount.value,
            totalTax: event.totalTax.value,
            subTotal: event.subTotal.value,
            grandTotal: event.grandTotal.value,
            items: event.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice.value,
            })),
            createdAt: event.createdAt,
          },
        };
      }
      case OrderConfirmedEvent.name: {
        const event = domain as OrderConfirmedEvent;
        return {
          ...orderEvent,
          streamName: event.orderId.toString(),
          data: {
            orderId: event.orderId.toString(),
            status: event.status,
            confirmedAt: event.confirmedAt,
            updatedAt: event.updatedAt,
          },
        };
      }
      case OrderCancelledEvent.name: {
        const event = domain as OrderCancelledEvent;
        return {
          ...orderEvent,
          streamName: event.orderId.toString(),
          data: {
            orderId: event.orderId.toString(),
            status: event.status,
            cancelledAt: event.cancelledAt,
            updatedAt: event.updatedAt,
          },
        };
      }
      default: {
        throw new Error(`Unknown event type: ${type}`);
      }
    }
  }
}
