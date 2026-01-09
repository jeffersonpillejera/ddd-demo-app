import { DomainEvent } from '@ecore/domain/core/domain-event';
import { Customer } from '../models/customer';

export class CustomerCreatedEvent implements DomainEvent {
  constructor(public readonly customer: Customer) {}
}
