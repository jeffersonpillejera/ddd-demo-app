import { DomainEvent } from '@ecore/domain/core/domain-event';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';

export class CreditPurchaseApprovedEvent extends DomainEvent {
  constructor(
    public readonly customerId: UniqueIdentifier,
    public readonly orderId: string,
  ) {
    super();
  }
}
