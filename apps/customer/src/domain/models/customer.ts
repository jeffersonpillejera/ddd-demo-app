import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { Address } from '@ecore/domain/common/value-objects/address';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import { Money } from '@ecore/domain/common/value-objects/money';
import { User } from './user';
import { AggregateRoot } from '@ecore/domain/core/aggregate-root';
import { CustomerCreatedEvent } from '../events/customer-created.event';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/domain/common/exceptions';

export interface CustomerProps {
  user: User;
  firstName: string;
  lastName: string;
  email: EmailAddress;
  creditLimit: Money;
  mobileNumber?: string | null;
  addresses?: Address[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Customer extends AggregateRoot<CustomerProps> {
  private constructor(props: CustomerProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  get user(): User {
    return this.props.user;
  }
  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get email(): EmailAddress {
    return this.props.email;
  }
  get mobileNumber(): string | null | undefined {
    return this.props.mobileNumber;
  }
  get creditLimit(): Money {
    return this.props.creditLimit;
  }
  get addresses(): Address[] | undefined {
    return this.props.addresses;
  }
  get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public static create(
    {
      user,
      firstName,
      lastName,
      email,
      mobileNumber,
      creditLimit,
      addresses,
      createdAt,
      updatedAt,
    }: CustomerProps,
    id?: UniqueIdentifier,
  ): Customer {
    if (!user) {
      throw new UnprocessableException('User is required');
    }
    if (!firstName || firstName.trim() === '') {
      throw new BadRequestException('First name is required');
    }
    if (!lastName || lastName.trim() === '') {
      throw new BadRequestException('Last name is required');
    }
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!creditLimit) {
      throw new BadRequestException('Credit limit is required');
    }
    const customer = new Customer(
      {
        user,
        firstName,
        lastName,
        email,
        mobileNumber,
        creditLimit,
        addresses: addresses ?? [],
        createdAt: createdAt ?? new Date(),
        updatedAt,
      },
      id,
    );

    if (!id && !createdAt)
      customer.addDomainEvent(new CustomerCreatedEvent(customer));

    return customer;
  }
}
