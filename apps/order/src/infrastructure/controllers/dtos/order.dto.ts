import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ApiCommonErrorResponses } from './common.dto';
import { CurrencyCodeEnum } from '@ecore/domain/common/value-objects/money';
import { Order } from '../entities/order.entity';

export class PlaceOrderItemDTO implements PlaceOrderItemDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

export class PlaceOrderDTO implements PlaceOrderDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  totalTax: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  subTotal: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  grandTotal: number;

  @ApiProperty({ example: CurrencyCodeEnum.USD })
  @IsEnum(CurrencyCodeEnum)
  @IsNotEmpty()
  currency: CurrencyCodeEnum;

  @ApiProperty({
    example: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1,
        unitPrice: 1000,
      },
    ],
    type: PlaceOrderItemDTO,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDTO)
  items: PlaceOrderItemDTO[];
}

export function ApiGetOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Get an order' }),
    ApiParam({
      name: 'id',
      description: 'The id of the order',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'The order has been found',
      type: Order,
    }),
    ApiCommonErrorResponses(),
  );
}

export function ApiPlaceOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Place an order' }),
    ApiBody({ type: PlaceOrderDTO }),
    ApiResponse({ status: 201, description: 'The order has been placed' }),
    ApiCommonErrorResponses(),
  );
}
