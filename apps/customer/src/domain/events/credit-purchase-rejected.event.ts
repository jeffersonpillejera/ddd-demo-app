import { DomainEvent } from '@ecore/core/domain-event';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';

export class CreditPurchaseRejectedEvent extends DomainEvent {
  constructor(
    public readonly customerId: UniqueIdentifier,
    public readonly orderId: string,
  ) {
    super();
  }
}
