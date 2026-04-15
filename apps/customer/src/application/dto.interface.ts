import {
  AddressTypeEnum,
  CountryCodeEnum,
} from '@ecore/core/common/value-objects/address';
import { MoneyProps } from '@ecore/core/common/value-objects/money';
import { IDomainEventDTO } from '@ecore/common/interface/domain-event.interface';

export interface ICustomerAddressDTO {
  label: string;
  street1: string;
  street2?: string | null;
  city: string;
  province: string;
  zip: string;
  country: CountryCodeEnum;
  type: AddressTypeEnum;
}

export interface ICustomerDTO {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  creditLimit: MoneyProps;
  addresses: ICustomerAddressDTO[];
}

export interface ICreateCustomerDTO {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  addresses: ICustomerAddressDTO[];
  password: string;
  lastIpAddress: string;
}

export interface ICreditPurchaseDTO {
  customerId: string;
  orderId: string;
  grandTotal: MoneyProps;
}

export interface ICustomerCreatedEventDTO extends IDomainEventDTO {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  creditLimit: MoneyProps;
  addresses: ICustomerAddressDTO[];
  createdAt: Date;
  mobileNumber?: string | null;
}

export interface ICreditPurchaseApprovedEventDTO extends IDomainEventDTO {
  customerId: string;
  orderId: string;
}

export interface ICreditPurchaseRejectedEventDTO extends IDomainEventDTO {
  customerId: string;
  orderId: string;
}
