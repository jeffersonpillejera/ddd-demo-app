import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ICreateCustomerDTO as ApplicationCreateCustomerDTO,
  ICustomerDTO,
} from '../../application/dto.interface';
import { Customer } from '../../domain/models/customer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AddressDTO,
  CreateAddressDTO,
  MoneyDTO,
} from '@ecore/common/dto/value-object.dto';
import { AddressProps } from '@ecore/core/common/value-objects/address';

export class CustomerAddressDTO extends AddressDTO {
  constructor(address: AddressProps) {
    super(address);
  }
}

export class CustomerDTO implements ICustomerDTO {
  @ApiProperty({ example: '123' })
  public readonly customerId: string;
  @ApiProperty({ example: 'john.doe@example.com' })
  public readonly email: string;
  @ApiProperty({ example: 'John' })
  public readonly firstName: string;
  @ApiProperty({ example: 'Doe' })
  public readonly lastName: string;
  @ApiPropertyOptional({ example: '+1234567890' })
  public readonly mobileNumber?: string | null;
  @ApiProperty({ example: { amount: 1000.01, currency: 'USD' } })
  public readonly creditLimit: MoneyDTO;
  @ApiProperty({ type: CustomerAddressDTO, isArray: true })
  public readonly addresses: CustomerAddressDTO[];

  /**
   * Converts a customer domain model to a DTO.
   * @param customer - The customer domain model to convert to a DTO.
   */
  constructor(customer: Customer) {
    this.customerId = customer.id.toString();
    this.email = customer.email.value;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.mobileNumber = customer.mobileNumber;
    this.creditLimit = customer.creditLimit.props;
    this.addresses =
      customer.addresses?.map(
        (address) => new CustomerAddressDTO(address.props),
      ) ?? [];
  }
}

export class CreateCustomerAddressDTO extends CreateAddressDTO {}

export class CreateCustomerDTO implements Omit<
  ApplicationCreateCustomerDTO,
  'lastIpAddress'
> {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail(undefined, { message: 'Invalid email address' })
  @IsNotEmpty()
  public readonly email!: string;
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  public readonly firstName!: string;
  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  public readonly lastName!: string;
  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  public readonly mobileNumber?: string | null;
  @ApiPropertyOptional({ type: CreateCustomerAddressDTO, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerAddressDTO)
  public readonly addresses!: CreateCustomerAddressDTO[];
  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
