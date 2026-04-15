import { MoneyProps } from '@ecore/core/common/value-objects/money';

export class OrderItemDTO {
  public readonly productId!: string;
  public readonly quantity!: number;
  public readonly unitPrice!: MoneyProps;
}

export class OrderPlacedEventDTO {
  public readonly orderId!: string;
  public readonly customerId!: string;
  public readonly status!: string;
  public readonly dateOrdered!: Date;
  public readonly discount!: MoneyProps;
  public readonly totalTax!: MoneyProps;
  public readonly subTotal!: MoneyProps;
  public readonly grandTotal!: MoneyProps;
  public readonly items!: OrderItemDTO[];
  public readonly createdAt!: Date;
}
