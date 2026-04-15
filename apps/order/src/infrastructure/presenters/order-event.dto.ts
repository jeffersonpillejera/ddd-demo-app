import { MoneyProps } from '@ecore/core/common/value-objects';
import {
  IOrderCanceledEventDTO,
  IOrderConfirmedEventDTO,
  IOrderItemDTO,
  IOrderPlacedEventDTO,
} from '../../application/dto.interface';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { ORDER_STATUS } from '../../domain/models/order';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';

export class OrderPlacedEventDTO implements IOrderPlacedEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly orderId: string;
  public readonly customerId: string;
  public readonly status: ORDER_STATUS;
  public readonly dateOrdered: Date;
  public readonly discount: MoneyProps;
  public readonly totalTax: MoneyProps;
  public readonly subTotal: MoneyProps;
  public readonly grandTotal: MoneyProps;
  public readonly items: IOrderItemDTO[];
  public readonly createdAt: Date;

  constructor(event: OrderPlacedEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.orderId = event.orderId.toString();
    this.customerId = event.customerId.toString();
    this.status = event.status;
    this.dateOrdered = event.dateOrdered;
    this.discount = event.discount.value;
    this.totalTax = event.totalTax.value;
    this.subTotal = event.subTotal.value;
    this.grandTotal = event.grandTotal.value;
    this.items = event.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice.value,
    }));
    this.createdAt = event.createdAt;
  }
}

export class OrderConfirmedEventDTO implements IOrderConfirmedEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly orderId: string;
  public readonly status: ORDER_STATUS;
  public readonly confirmedAt: Date;
  public readonly updatedAt: Date;

  constructor(event: OrderConfirmedEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.orderId = event.orderId.toString();
    this.status = event.status;
    this.confirmedAt = event.confirmedAt;
    this.updatedAt = event.updatedAt;
  }
}

export class OrderCancelledEventDTO implements IOrderCanceledEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly orderId: string;
  public readonly status: ORDER_STATUS;
  public readonly cancelledAt: Date;
  public readonly updatedAt: Date;

  constructor(event: OrderCancelledEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.orderId = event.orderId.toString();
    this.status = event.status;
    this.cancelledAt = event.cancelledAt;
    this.updatedAt = event.updatedAt;
  }
}
