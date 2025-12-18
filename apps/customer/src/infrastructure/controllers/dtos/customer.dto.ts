import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CustomerAddressDTO,
  RegisterUserDTO as ApplicationRegisterUserDTO,
} from '../../../application/dtos/customer.dto';
import { Customer } from '../entities/customer.entity';
import { AddressTypeEnum } from '@ecore/domain/common/value-objects/address';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ApiCommonErrorResponses } from './common.dto';

export class RegisterCustomerAddressDTO implements CustomerAddressDTO {
  @ApiProperty({ example: 'Home' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street1: string;

  @ApiPropertyOptional({ example: 'Apt 1' })
  @IsString()
  @IsOptional()
  street2?: string;

  @ApiProperty({ example: 'Anytown' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'CA' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @MinLength(2)
  country: string;

  @ApiProperty({ example: AddressTypeEnum.BILLING, enum: AddressTypeEnum })
  @IsEnum(AddressTypeEnum)
  @IsNotEmpty()
  type: AddressTypeEnum;
}

export class RegisterUserDTO implements Omit<
  ApplicationRegisterUserDTO,
  'lastIpAddress'
> {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail(undefined, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  mobileNumber?: string | null;

  @ApiPropertyOptional({
    example: [
      {
        label: 'Home',
        street1: '123 Main St',
        street2: 'Apt 1',
        city: 'Anytown',
        province: 'CA',
        zip: '12345',
        country: 'US',
        type: AddressTypeEnum.BILLING,
      },
    ],
    type: RegisterCustomerAddressDTO,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RegisterCustomerAddressDTO)
  addresses?: RegisterCustomerAddressDTO[];

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export function ApiGetCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a customer' }),
    ApiParam({
      name: 'id',
      description: 'The id of the customer',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'The customer has been found',
      type: Customer,
    }),
    ApiCommonErrorResponses(),
  );
}

export function ApiRegisterUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a user' }),
    ApiBody({ type: RegisterUserDTO }),
    ApiResponse({ status: 201, description: 'The user has been registered' }),
    ApiCommonErrorResponses(),
  );
}
