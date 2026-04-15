import { DomainEvent } from '@ecore/core/domain-event';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import { ORDER_STATUS } from '../models/order';

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    public readonly orderId: UniqueIdentifier,
    public readonly status: ORDER_STATUS,
    public readonly cancelledAt: Date,
    public readonly updatedAt: Date,
  ) {
    super();
  }
}
