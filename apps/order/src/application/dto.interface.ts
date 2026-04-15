import {
  CurrencyCodeEnum,
  MoneyProps,
} from '@ecore/core/common/value-objects/money';
import { ORDER_STATUS } from '../domain/models/order';

export interface IPlaceOrderDTO {
  customerId: string;
  discount: number;
  totalTax: number;
  subTotal: number;
  grandTotal: number;
  currency: CurrencyCodeEnum;
  items: IPlaceOrderItemDTO[];
}

export interface IPlaceOrderItemDTO extends Omit<IOrderItemDTO, 'unitPrice'> {
  unitPrice: number;
}

export interface IOrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: MoneyProps;
}

export interface IOrderDTO {
  orderId: string;
  customerId: string;
  status: ORDER_STATUS;
  dateOrdered: Date;
  discount: MoneyProps;
  totalTax: MoneyProps;
  subTotal: MoneyProps;
  grandTotal: MoneyProps;
  items: IOrderItemDTO[];
  createdAt: Date;
  updatedAt?: Date | null;
  confirmedAt?: Date | null;
  cancelledAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  completedAt?: Date | null;
}

export interface IOrderPlacedEventDTO {
  orderId: string;
  customerId: string;
  status: ORDER_STATUS;
  dateOrdered: Date;
  discount: MoneyProps;
  totalTax: MoneyProps;
  subTotal: MoneyProps;
  grandTotal: MoneyProps;
  items: IOrderItemDTO[];
  createdAt: Date;
}

export interface IOrderConfirmedEventDTO {
  orderId: string;
  status: ORDER_STATUS;
  confirmedAt: Date;
  updatedAt: Date;
}

export interface IOrderCanceledEventDTO {
  orderId: string;
  status: ORDER_STATUS;
  cancelledAt: Date;
  updatedAt: Date;
}

export interface IOrderEventsDTO {
  id: string;
  type: string;
  streamName: string;
  data: IOrderPlacedEventDTO | IOrderConfirmedEventDTO | IOrderCanceledEventDTO;
  occurredAt: Date;
  version: number;
  correlationId?: string;
  causationId?: string;
}
