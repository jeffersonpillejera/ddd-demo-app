import { DomainEvent } from '@ecore/domain/core/domain-event';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import { Money } from '@ecore/domain/common/value-objects/money';
import { Address } from '@ecore/domain/common/value-objects/address';

export class CustomerCreatedEvent implements DomainEvent {
  constructor(
    public readonly customerId: UniqueIdentifier,
    public readonly email: EmailAddress,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly creditLimit: Money,
    public readonly addresses: Address[] | null,
    public readonly createdAt: Date,
    public readonly mobileNumber?: string | null,
  ) {}
}
