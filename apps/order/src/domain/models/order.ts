import { Money } from '@ecore/domain/common/value-objects/money';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { AggregateRoot } from '@ecore/domain/core/event-sourcing/aggregate-root';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/domain/common/exceptions';
import { OrderItem } from './order-item';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';
import { OrderCancelledEvent } from '../events/order-cancelled.event';
import { DomainEvent } from '@ecore/domain/core/domain-event';
export type OrderEvents =
  | OrderPlacedEvent
  | OrderConfirmedEvent
  | OrderCancelledEvent;
export const ORDER_EVENTS = [
  OrderPlacedEvent.name,
  OrderConfirmedEvent.name,
  OrderCancelledEvent.name,
];
export const ORDER_ID_PREFIX = 'O';
export const ORDER_ID_LENGTH = 18;
export enum ORDER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface OrderProps {
  status: ORDER_STATUS;
  customerId: string;
  dateOrdered?: Date | null;
  discount: Money;
  totalTax: Money;
  subTotal: Money;
  grandTotal: Money;
  items: OrderItem[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
  confirmedAt?: Date | null;
  cancelledAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  completedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id: UniqueIdentifier) {
    super(props, id);
  }

  get status(): ORDER_STATUS {
    return this.props.status;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get dateOrdered(): Date | null | undefined {
    return this.props.dateOrdered;
  }
  get discount(): Money {
    return this.props.discount;
  }
  get totalTax(): Money {
    return this.props.totalTax;
  }
  get subTotal(): Money {
    return this.props.subTotal;
  }
  get grandTotal(): Money {
    return this.props.grandTotal;
  }
  get items(): OrderItem[] {
    return this.props.items;
  }
  get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
  get confirmedAt(): Date | null | undefined {
    return this.props.confirmedAt;
  }
  get cancelledAt(): Date | null | undefined {
    return this.props.cancelledAt;
  }
  get shippedAt(): Date | null | undefined {
    return this.props.shippedAt;
  }
  get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt;
  }
  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  public static create(
    {
      status,
      customerId,
      dateOrdered,
      discount,
      totalTax,
      subTotal,
      grandTotal,
      items,
      createdAt,
      updatedAt,
      confirmedAt,
      cancelledAt,
      shippedAt,
      deliveredAt,
      completedAt,
    }: OrderProps,
    id: UniqueIdentifier,
  ): Order {
    Order.validateOrderId(id);
    if (!status) {
      throw new BadRequestException('Status is required');
    }
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    if (!customerId) {
      throw new BadRequestException('Customer ID is required');
    }
    if (!discount) {
      throw new BadRequestException('Discount is required');
    }
    if (!totalTax) {
      throw new BadRequestException('Total tax is required');
    }
    if (!subTotal) {
      throw new BadRequestException('Sub total is required');
    }
    if (!grandTotal) {
      throw new BadRequestException('Grand total is required');
    }
    if (!items || items.length === 0) {
      throw new BadRequestException('Items are required');
    }
    if (
      !subTotal.isEqualTo(
        items.reduce(
          (acc, item) => acc.add(item.totalPrice),
          Money.create({ amount: 0, currency: subTotal.props.currency }),
        ),
      )
    ) {
      throw new BadRequestException(
        'Sub total is not equal to the sum of the unit prices of the items',
      );
    }
    if (!subTotal.add(discount).add(totalTax).isEqualTo(grandTotal)) {
      throw new BadRequestException(
        'Grand total is not equal to the sub total plus discount plus total tax',
      );
    }
    if (!createdAt && status !== ORDER_STATUS.PENDING) {
      throw new BadRequestException(
        `Created At is required for ${status} orders`,
      );
    }
    const order = new Order(
      {
        status,
        customerId,
        dateOrdered: dateOrdered ?? new Date(),
        discount,
        totalTax,
        subTotal,
        grandTotal,
        items,
        createdAt: createdAt ?? new Date(),
        updatedAt,
        confirmedAt,
        cancelledAt,
        shippedAt,
        deliveredAt,
        completedAt,
      },
      id,
    );

    if (!createdAt && status === ORDER_STATUS.PENDING)
      order.apply(
        new OrderPlacedEvent(
          id,
          status,
          customerId,
          dateOrdered ?? new Date(),
          discount,
          totalTax,
          subTotal,
          grandTotal,
          items,
          createdAt ?? new Date(),
        ),
      );
    return order;
  }

  private static validateOrderId(id: UniqueIdentifier): void {
    if (!id) {
      throw new UnprocessableException('ID is required');
    }
    if (id.toString().substring(1).length !== ORDER_ID_LENGTH) {
      throw new UnprocessableException(
        `ID must be ${ORDER_ID_LENGTH} characters long after the prefix`,
      );
    }
    // The first character must be ${ORDER_ID_PREFIX},
    // and the next 8 characters of the ID are numbers,
    // and the last 10 characters are alphanumeric,
    // but the alphabets are capitalised only ex. O20251218ER79UP7786
    if (!/^[${ORDER_ID_PREFIX}]+[0-9]{8}[A-Z0-9]{10}$/.test(id.toString())) {
      throw new UnprocessableException('ID is invalid');
    }
  }

  public cancel(): void {
    if (
      [
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.DELIVERED,
      ].includes(this.props.status)
    ) {
      throw new BadRequestException('Order cannot be cancelled');
    }
    this.apply(
      new OrderCancelledEvent(
        this.id,
        ORDER_STATUS.CANCELLED,
        new Date(),
        new Date(),
      ),
    );
  }

  public confirm(): void {
    if (this.props.status === ORDER_STATUS.CONFIRMED) {
      throw new BadRequestException('Order is already confirmed');
    }
    if (this.props.status !== ORDER_STATUS.PENDING) {
      throw new BadRequestException('You can only confirm pending orders');
    }
    this.apply(
      new OrderConfirmedEvent(
        this.id,
        ORDER_STATUS.CONFIRMED,
        new Date(),
        new Date(),
      ),
    );
  }

  protected when(event: DomainEvent): void {
    switch (event.type) {
      case OrderPlacedEvent.name: {
        const order = event as OrderPlacedEvent;
        this.props.status = order.status;
        this.props.customerId = order.customerId;
        this.props.dateOrdered = order.dateOrdered;
        this.props.discount = order.discount;
        this.props.totalTax = order.totalTax;
        this.props.subTotal = order.subTotal;
        this.props.grandTotal = order.grandTotal;
        this.props.items = order.items;
        this.props.createdAt = order.createdAt;
        break;
      }
      case OrderConfirmedEvent.name: {
        const order = event as OrderConfirmedEvent;
        this.props.status = order.status;
        this.props.updatedAt = order.updatedAt;
        this.props.confirmedAt = order.confirmedAt;
        break;
      }
      case OrderCancelledEvent.name: {
        const order = event as OrderCancelledEvent;
        this.props.status = order.status;
        this.props.cancelledAt = order.cancelledAt;
        this.props.updatedAt = order.updatedAt;
        break;
      }
    }
  }
}
