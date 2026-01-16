import { DomainEvent } from '@ecore/domain/core/domain-event';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { ORDER_STATUS } from '../models/order';

export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    public readonly orderId: UniqueIdentifier,
    public readonly status: ORDER_STATUS,
    public readonly confirmedAt: Date,
    public readonly updatedAt: Date,
  ) {
    super();
  }
}
