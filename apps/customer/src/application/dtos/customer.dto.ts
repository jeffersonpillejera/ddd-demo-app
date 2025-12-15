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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  creditLimit: MoneyProps;
  addresses: CustomerAddressDTO[];
}

export interface RegisterUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  addresses?: CustomerAddressDTO[];
  password: string;
  lastIpAddress: string;
}
