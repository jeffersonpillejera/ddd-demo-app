import { DataMapper } from '@ecore/domain/core/data-mapper';
import { Order, ORDER_STATUS } from '../../domain/models/order';
import { Injectable } from '@nestjs/common';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { OrderItem } from '../../domain/models/order-item';
import { Prisma } from '../projection-store/prisma/generated/client';
import { CurrencyCodeEnum } from '@ecore/domain/common/value-objects/money';
import { Decimal } from '@prisma/client/runtime/client';

type PesistedOrderEntity = Prisma.OrderGetPayload<{ include: { items: true } }>;
type PersistOrderDTO = Omit<Prisma.OrderCreateInput, 'items'> & {
  items: Prisma.OrderItemCreateWithoutOrderInput[];
};

@Injectable()
export class OrderDataMapper extends DataMapper<
  Order,
  PersistOrderDTO | PesistedOrderEntity
> {
  toDomain(data: PesistedOrderEntity): Order {
    return Order.create(
      {
        customerId: data.customerId,
        status: data.status as ORDER_STATUS,
        dateOrdered: data.dateOrdered,
        discount: this.toMoney({
          amount: data.discount.toNumber(),
          currency: data.currency as CurrencyCodeEnum,
        }),
        totalTax: this.toMoney({
          amount: data.totalTax.toNumber(),
          currency: data.currency as CurrencyCodeEnum,
        }),
        subTotal: this.toMoney({
          amount: data.subTotal.toNumber(),
          currency: data.currency as CurrencyCodeEnum,
        }),
        grandTotal: this.toMoney({
          amount: data.grandTotal.toNumber(),
          currency: data.currency as CurrencyCodeEnum,
        }),
        items: data.items.map((item) =>
          OrderItem.create(
            {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: this.toMoney({
                amount: item.unitPrice.toNumber(),
                currency: data.currency as CurrencyCodeEnum,
              }),
            },
            new UniqueIdentifier(item.id),
          ),
        ),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        confirmedAt: data.confirmedAt,
        cancelledAt: data.cancelledAt,
        shippedAt: data.shippedAt,
        deliveredAt: data.deliveredAt,
        completedAt: data.completedAt,
      },
      new UniqueIdentifier(data.id),
    );
  }

  toPersistence(domain: Order): PersistOrderDTO {
    return {
      id: domain.id.toString(),
      customerId: domain.customerId,
      status: domain.status,
      dateOrdered: domain.dateOrdered!,
      currency: domain.subTotal.props.currency,
      discount: new Decimal(domain.discount.props.amount),
      totalTax: new Decimal(domain.totalTax.props.amount),
      subTotal: new Decimal(domain.subTotal.props.amount),
      grandTotal: new Decimal(domain.grandTotal.props.amount),
      items: domain.items.map((item) => ({
        id: item.id.toString(),
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: new Decimal(item.unitPrice.props.amount),
      })),
      createdAt: domain.createdAt!,
      updatedAt: domain.updatedAt,
      confirmedAt: domain.confirmedAt,
      cancelledAt: domain.cancelledAt,
      shippedAt: domain.shippedAt,
      deliveredAt: domain.deliveredAt,
      completedAt: domain.completedAt,
    };
  }
}
