import { DomainEvent } from '@ecore/domain/core/domain-event';

export class CreditPurchaseApprovedEvent implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly orderId: string,
  ) {}
}
