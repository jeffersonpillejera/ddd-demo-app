import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoneyProps } from '@ecore/core/common/value-objects';
import { AddressProps } from '@ecore/core/common/value-objects';
import { AddressTypeEnum } from '@ecore/core/common/value-objects';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  CountryCodeEnum,
  CurrencyCodeEnum,
} from '@ecore/core/common/value-objects';

export class MoneyDTO implements MoneyProps {
  @ApiProperty({ example: 1000.01 })
  public readonly amount!: number;
  @ApiProperty({ example: 'USD' })
  public readonly currency!: CurrencyCodeEnum;
}

export class AddressDTO implements AddressProps {
  @ApiPropertyOptional({ example: 'Home' })
  public readonly label!: string;
  @ApiPropertyOptional({ example: '123 Main St' })
  public readonly street1!: string;
  @ApiPropertyOptional({ example: 'Street 2' })
  public readonly street2?: string | null;
  @ApiPropertyOptional({ example: 'New York' })
  public readonly city!: string;
  @ApiPropertyOptional({ example: 'NY' })
  public readonly province!: string;
  @ApiPropertyOptional({ example: '10001' })
  public readonly zip!: string;
  @ApiProperty({ example: CountryCodeEnum.US })
  public readonly country!: CountryCodeEnum;
  @ApiProperty({ example: AddressTypeEnum.BILLING })
  public readonly type!: AddressTypeEnum;

  constructor(address: AddressProps) {
    this.label = address.label;
    this.street1 = address.street1;
    this.street2 = address.street2;
    this.city = address.city;
    this.province = address.province;
    this.zip = address.zip;
    this.country = address.country;
    this.type = address.type;
  }
}

export class CreateAddressDTO implements AddressProps {
  @ApiProperty({ example: 'Home' })
  @IsString()
  @IsNotEmpty()
  public readonly label!: string;
  @ApiPropertyOptional({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  public readonly street1!: string;
  @ApiPropertyOptional({ example: 'Street 2' })
  @IsString()
  @IsOptional()
  public readonly street2?: string | null;
  @ApiPropertyOptional({ example: 'New York' })
  @IsString()
  @IsOptional()
  public readonly city!: string;
  @ApiPropertyOptional({ example: 'NY' })
  @IsString()
  @IsOptional()
  public readonly province!: string;
  @ApiPropertyOptional({ example: '10001', type: 'string' })
  @IsString()
  @IsOptional()
  public readonly zip!: string;
  @ApiProperty({ example: CountryCodeEnum.US })
  @IsEnum(CountryCodeEnum)
  @IsNotEmpty()
  public readonly country!: CountryCodeEnum;
  @ApiProperty({ example: AddressTypeEnum.BILLING })
  @IsEnum(AddressTypeEnum)
  @IsNotEmpty()
  public readonly type!: AddressTypeEnum;
}
