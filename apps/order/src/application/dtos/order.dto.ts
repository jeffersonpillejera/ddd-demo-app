import {
  CurrencyCodeEnum,
  MoneyProps,
} from '@ecore/domain/common/value-objects/money';
import { ORDER_STATUS } from '../../domain/models/order';

export interface PlaceOrderDTO {
  customerId: string;
  discount: number;
  totalTax: number;
  subTotal: number;
  grandTotal: number;
  currency: CurrencyCodeEnum;
  items: PlaceOrderItemDTO[];
}

export interface PlaceOrderItemDTO extends Omit<OrderItemDTO, 'unitPrice'> {
  unitPrice: number;
}

export interface OrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: MoneyProps;
}

export interface OrderDTO {
  orderId: string;
  customerId: string;
  status: ORDER_STATUS;
  dateOrdered: Date;
  discount: MoneyProps;
  totalTax: MoneyProps;
  subTotal: MoneyProps;
  grandTotal: MoneyProps;
  items: OrderItemDTO[];
  createdAt: Date;
  updatedAt?: Date | null;
  confirmedAt?: Date | null;
  cancelledAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  completedAt?: Date | null;
}

export interface OrderPlacedEventDTO {
  orderId: string;
  customerId: string;
  status: ORDER_STATUS;
  dateOrdered: Date;
  discount: MoneyProps;
  totalTax: MoneyProps;
  subTotal: MoneyProps;
  grandTotal: MoneyProps;
  items: OrderItemDTO[];
  createdAt: Date;
}

export interface OrderConfirmedEventDTO {
  orderId: string;
  status: ORDER_STATUS;
  confirmedAt: Date;
  updatedAt: Date;
}

export interface OrderCanceledEventDTO {
  orderId: string;
  status: ORDER_STATUS;
  cancelledAt: Date;
  updatedAt: Date;
}

export interface OrderEventsDTO {
  id: string;
  type: string;
  streamName: string;
  data: OrderPlacedEventDTO | OrderConfirmedEventDTO | OrderCanceledEventDTO;
  occurredAt: Date;
  version: number;
  correlationId?: string;
  causationId?: string;
}
