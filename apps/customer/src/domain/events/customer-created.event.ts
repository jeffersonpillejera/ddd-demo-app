import { DomainEvent } from '@ecore/core/domain-event';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import { EmailAddress } from '@ecore/core/common/value-objects/email-address';
import { Money } from '@ecore/core/common/value-objects/money';
import { Address } from '@ecore/core/common/value-objects/address';

export class CustomerCreatedEvent extends DomainEvent {
  constructor(
    public readonly customerId: UniqueIdentifier,
    public readonly email: EmailAddress,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly creditLimit: Money,
    public readonly addresses: Address[] | null,
    public readonly createdAt: Date,
    public readonly mobileNumber?: string | null,
  ) {
    super();
  }
}
