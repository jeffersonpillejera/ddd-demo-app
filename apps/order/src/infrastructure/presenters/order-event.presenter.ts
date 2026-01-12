import { Presenter } from '@ecore/domain/core/presenter';
import {
  OrderPlacedEventDTO,
  OrderConfirmedEventDTO,
  OrderCanceledEventDTO,
} from '../../application/dtos/order.dto';
import { DomainEvent } from '@ecore/domain/core/domain-event';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';

type OrderEventDTO =
  | OrderPlacedEventDTO
  | OrderConfirmedEventDTO
  | OrderCanceledEventDTO;

export class OrderEventPresenter implements Presenter<
  DomainEvent,
  OrderEventDTO
> {
  toDTO(domain: DomainEvent): OrderEventDTO {
    switch (domain.constructor.name) {
      case OrderPlacedEvent.name: {
        const orderPlacedEvent = domain as unknown as OrderPlacedEvent;
        return {
          orderId: orderPlacedEvent.orderId.toString(),
          customerId: orderPlacedEvent.customerId,
          status: orderPlacedEvent.status,
          dateOrdered: orderPlacedEvent.dateOrdered,
          discount: orderPlacedEvent.discount.value,
          totalTax: orderPlacedEvent.totalTax.value,
          subTotal: orderPlacedEvent.subTotal.value,
          grandTotal: orderPlacedEvent.grandTotal.value,
          items: orderPlacedEvent.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.value,
          })),
          createdAt: orderPlacedEvent.createdAt,
        };
      }
      case OrderConfirmedEvent.name: {
        const orderConfirmedEvent = domain as unknown as OrderConfirmedEvent;
        return {
          orderId: orderConfirmedEvent.orderId.toString(),
          status: orderConfirmedEvent.status,
          confirmedAt: orderConfirmedEvent.confirmedAt,
          updatedAt: orderConfirmedEvent.updatedAt,
        };
      }
      case OrderCancelledEvent.name: {
        const orderCancelledEvent = domain as unknown as OrderCancelledEvent;
        return {
          orderId: orderCancelledEvent.orderId.toString(),
          status: orderCancelledEvent.status,
          cancelledAt: orderCancelledEvent.cancelledAt,
          updatedAt: orderCancelledEvent.updatedAt,
        };
      }
      default: {
        throw new Error(`Unknown event type: ${domain.constructor.name}`);
      }
    }
  }
}
