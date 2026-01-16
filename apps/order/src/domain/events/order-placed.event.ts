import { Money } from '@ecore/domain/common/value-objects/money';
import { DomainEvent } from '@ecore/domain/core/domain-event';
import { OrderItem } from '../models/order-item';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { ORDER_STATUS } from '../models/order';

export class OrderPlacedEvent extends DomainEvent {
  constructor(
    public readonly orderId: UniqueIdentifier,
    public readonly status: ORDER_STATUS,
    public readonly customerId: string,
    public readonly dateOrdered: Date,
    public readonly discount: Money,
    public readonly totalTax: Money,
    public readonly subTotal: Money,
    public readonly grandTotal: Money,
    public readonly items: OrderItem[],
    public readonly createdAt: Date,
  ) {
    super();
  }
}
