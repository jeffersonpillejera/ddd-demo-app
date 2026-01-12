import { DomainEvent } from '@ecore/domain/core/domain-event';

export class CreditPurchaseRejectedEvent implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly orderId: string,
  ) {}
}
