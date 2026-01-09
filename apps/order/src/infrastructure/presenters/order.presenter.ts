import { Presenter } from '@ecore/domain/core/presenter';
import { Order } from '../../domain/models/order';
import { OrderDTO } from '../../application/dtos/order.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderPresenter implements Presenter<Order, OrderDTO> {
  toDTO(domain: Order): OrderDTO {
    return {
      orderId: domain.id.toString(),
      customerId: domain.customerId,
      status: domain.status,
      dateOrdered: domain.dateOrdered!,
      discount: domain.discount.props,
      totalTax: domain.totalTax.props,
      subTotal: domain.subTotal.props,
      grandTotal: domain.grandTotal.props,
      items: domain.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.props,
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
