import {
  CurrencyCodeEnum,
  MoneyProps,
} from '@ecore/domain/common/value-objects/money';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDTO, OrderItemDTO } from '../../../application/dtos/order.dto';
import { ORDER_STATUS } from '../../../domain/models/order';

export class Money implements MoneyProps {
  @ApiProperty({ example: 1000.01 })
  amount: number;
  @ApiProperty({ example: CurrencyCodeEnum.USD })
  currency: CurrencyCodeEnum;
}

export class OrderItem implements OrderItemDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  productId: string;
  @ApiProperty({ example: 1 })
  quantity: number;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: Money,
  })
  unitPrice: Money;
}

export class Order implements OrderDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  orderId: string;
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  customerId: string;
  @ApiProperty({ example: ORDER_STATUS.PENDING, enum: ORDER_STATUS })
  status: ORDER_STATUS;
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  dateOrdered: Date;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: Money,
  })
  discount: Money;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: Money,
  })
  totalTax: Money;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: Money,
  })
  subTotal: Money;
  @ApiProperty({
    example: { amount: 1000, currency: CurrencyCodeEnum.USD },
    type: Money,
  })
  grandTotal: Money;
  @ApiProperty({ example: [OrderItem], type: OrderItem, isArray: true })
  items: OrderItem[];
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  confirmedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  cancelledAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  shippedAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  deliveredAt?: Date | null;
  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  completedAt?: Date | null;
}
