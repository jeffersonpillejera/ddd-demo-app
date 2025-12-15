import { AddressTypeEnum } from '@ecore/domain/common/value-objects/address';
import {
  CustomerAddressDTO,
  CustomerDTO,
} from '../../../application/dtos/customer.dto';
import {
  CurrencyCodeEnum,
  MoneyProps,
} from '@ecore/domain/common/value-objects/money';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MoneyEntity implements MoneyProps {
  @ApiProperty({ example: 1000.01 })
  amount: number;
  @ApiProperty({ example: CurrencyCodeEnum.USD })
  currency: CurrencyCodeEnum;
}

export class CustomerAddressEntity implements CustomerAddressDTO {
  @ApiProperty({ example: 'Home' })
  label: string;
  @ApiProperty({ example: '123 Main St' })
  street1: string;
  @ApiPropertyOptional({ example: 'Apt 1' })
  street2?: string;
  @ApiProperty({ example: 'Anytown' })
  city: string;
  @ApiProperty({ example: 'CA' })
  province: string;
  @ApiProperty({ example: '12345' })
  zip: string;
  @ApiProperty({ example: 'USA' })
  country: string;
  @ApiProperty({ example: AddressTypeEnum.BILLING, enum: AddressTypeEnum })
  type: AddressTypeEnum;
}

export class CustomerEntity implements CustomerDTO {
  @ApiProperty({ example: '123' })
  id: string;
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;
  @ApiProperty({ example: 'John' })
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  lastName: string;
  @ApiPropertyOptional({ example: '+1234567890' })
  mobileNumber?: string | null;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyEntity,
  })
  creditLimit: MoneyEntity;
  @ApiProperty({
    example: [
      {
        label: 'Home',
        street1: '123 Main St',
        street2: 'Apt 1',
        city: 'Anytown',
        province: 'CA',
        zip: '12345',
        country: 'USA',
        type: AddressTypeEnum.BILLING,
      },
    ],
    type: CustomerAddressEntity,
    isArray: true,
  })
  addresses: CustomerAddressEntity[];
}
