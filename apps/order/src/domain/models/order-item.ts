import { Money } from '@ecore/core/common/value-objects/money';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import { BadRequestException } from '@ecore/core/common/exceptions';
import { Entity } from '@ecore/core/entity';

export interface OrderItemProps {
  productId: string;
  quantity: number;
  unitPrice: Money;
}

export class OrderItem extends Entity<OrderItemProps> {
  private constructor(props: OrderItemProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  get productId(): string {
    return this.props.productId;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get unitPrice(): Money {
    return this.props.unitPrice;
  }
  get totalPrice(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  public static create(
    { productId, quantity, unitPrice }: OrderItemProps,
    id?: UniqueIdentifier,
  ): OrderItem {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    if (!unitPrice) {
      throw new BadRequestException('Unit price is required');
    }
    return new OrderItem({ productId, quantity, unitPrice }, id);
  }
}
