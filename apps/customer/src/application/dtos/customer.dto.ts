import { AddressTypeEnum } from '@ecore/domain/common/value-objects/address';
import { MoneyProps } from '@ecore/domain/common/value-objects/money';

export interface CustomerAddressDTO {
  label: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  type: AddressTypeEnum;
}

export interface CustomerDTO {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  creditLimit: MoneyProps;
  addresses: CustomerAddressDTO[];
}

export interface CreateCustomerDTO {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  addresses: CustomerAddressDTO[];
  password: string;
  lastIpAddress: string;
}

export interface CreditPurchaseDTO {
  customerId: string;
  orderId: string;
  grandTotal: MoneyProps;
}

export interface CustomerCreatedEventDTO {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  creditLimit: MoneyProps;
  addresses: CustomerAddressDTO[];
  createdAt: Date;
  mobileNumber?: string | null;
}

export interface CreditPurchaseApprovedEventDTO {
  customerId: string;
  orderId: string;
  amount: MoneyProps;
}

export interface CreditPurchaseRejectedEventDTO {
  customerId: string;
  orderId: string;
}
