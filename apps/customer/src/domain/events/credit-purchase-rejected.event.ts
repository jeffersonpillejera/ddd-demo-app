import { DomainEvent } from '@ecore/domain/core/domain-event';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';

export class CreditPurchaseRejectedEvent extends DomainEvent {
  constructor(
    public readonly customerId: UniqueIdentifier,
    public readonly orderId: string,
  ) {
    super();
  }
}
