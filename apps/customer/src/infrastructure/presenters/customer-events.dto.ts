import { MoneyProps } from '@ecore/core/common/value-objects';
import {
  ICreditPurchaseApprovedEventDTO,
  ICreditPurchaseRejectedEventDTO,
  ICustomerAddressDTO,
  ICustomerCreatedEventDTO,
} from '../../application/dto.interface';
import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { CustomerAddressDTO } from './customer.dto';
import { CreditPurchaseRejectedEvent } from '../../domain/events/credit-purchase-rejected.event';
import { CreditPurchaseApprovedEvent } from '../../domain/events/credit-purchase-approved.event';

export class CustomerCreatedEventDTO implements ICustomerCreatedEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly customerId: string;
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly creditLimit: MoneyProps;
  public readonly addresses: ICustomerAddressDTO[];
  public readonly createdAt: Date;
  public readonly mobileNumber?: string | null;

  constructor(event: CustomerCreatedEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.customerId = event.customerId.toString();
    this.email = event.email.value;
    this.firstName = event.firstName;
    this.lastName = event.lastName;
    this.creditLimit = event.creditLimit.value;
    this.addresses =
      event.addresses?.map(
        (address) => new CustomerAddressDTO(address.props),
      ) ?? [];
    this.createdAt = event.createdAt;
    this.mobileNumber = event.mobileNumber;
  }
}

export class CreditPurchaseApprovedEventDTO implements ICreditPurchaseApprovedEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly customerId: string;
  public readonly orderId: string;

  constructor(event: CreditPurchaseApprovedEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.customerId = event.customerId.toString();
    this.orderId = event.orderId.toString();
  }
}

export class CreditPurchaseRejectedEventDTO implements ICreditPurchaseRejectedEventDTO {
  public readonly _eventId: string;
  public readonly _eventOccurredAt: Date;
  public readonly customerId: string;
  public readonly orderId: string;

  constructor(event: CreditPurchaseRejectedEvent) {
    this._eventId = event.id;
    this._eventOccurredAt = event.occurredAt;
    this.customerId = event.customerId.toString();
    this.orderId = event.orderId.toString();
  }
}
