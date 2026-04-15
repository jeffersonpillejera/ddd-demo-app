import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { CurrencyCodeEnum } from '@ecore/core/common/value-objects/money';
import {
  IPlaceOrderDTO,
  IPlaceOrderItemDTO,
} from '../../application/dto.interface';
import { IOrderDTO, IOrderItemDTO } from '../../application/dto.interface';
import { ORDER_STATUS } from '../../domain/models/order';
import { MoneyDTO } from '@ecore/common/dto/value-object.dto';
import { Order } from '../../domain/models/order';

export class OrderItemDTO implements IOrderItemDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public readonly productId!: string;
  @ApiProperty({ example: 1 })
  public readonly quantity!: number;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyDTO,
  })
  public readonly unitPrice!: MoneyDTO;
}

export class OrderDTO implements IOrderDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public readonly orderId!: string;
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public readonly customerId!: string;
  @ApiProperty({ example: ORDER_STATUS.PENDING, enum: ORDER_STATUS })
  public readonly status!: ORDER_STATUS;
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  public readonly dateOrdered!: Date;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyDTO,
  })
  public readonly discount!: MoneyDTO;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyDTO,
  })
  public readonly totalTax!: MoneyDTO;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyDTO,
  })
  public readonly subTotal!: MoneyDTO;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: MoneyDTO,
  })
  public readonly grandTotal!: MoneyDTO;
  @ApiProperty({ example: [OrderItemDTO], type: OrderItemDTO, isArray: true })
  public readonly items!: OrderItemDTO[];
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  public readonly createdAt!: Date;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly updatedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly confirmedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly cancelledAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly shippedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly deliveredAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  public readonly completedAt?: Date | null;

  constructor(order: Order) {
    this.orderId = order.id.toString();
    this.customerId = order.customerId;
    this.status = order.status;
    this.dateOrdered = order.dateOrdered!;
    this.discount = order.discount.props;
    this.totalTax = order.totalTax.props;
    this.subTotal = order.subTotal.props;
    this.grandTotal = order.grandTotal.props;
    this.items = order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice.props,
    }));
    this.createdAt = order.createdAt!;
    this.updatedAt = order.updatedAt;
    this.confirmedAt = order.confirmedAt;
    this.cancelledAt = order.cancelledAt;
    this.shippedAt = order.shippedAt;
    this.deliveredAt = order.deliveredAt;
    this.completedAt = order.completedAt;
  }
}

export class PlaceOrderItemDTO implements IPlaceOrderItemDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  public readonly productId!: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  public readonly quantity!: number;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  public readonly unitPrice!: number;
}

export class PlaceOrderDTO implements IPlaceOrderDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  public readonly customerId!: string;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  public readonly discount!: number;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  public readonly totalTax!: number;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  public readonly subTotal!: number;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  public readonly grandTotal!: number;
  @ApiProperty({ example: CurrencyCodeEnum.USD })
  @IsEnum(CurrencyCodeEnum)
  @IsNotEmpty()
  public readonly currency!: CurrencyCodeEnum;
  @ApiProperty({ type: PlaceOrderItemDTO, isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDTO)
  public readonly items!: IPlaceOrderItemDTO[];
}
