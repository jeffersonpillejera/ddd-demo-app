import { Order } from '../../domain/models/order';
import { Query } from '@ecore/domain/core/cqrs/query';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Presenter } from '@ecore/domain/core/presenter';
import { ILogger } from '@ecore/domain/core/logger';
import { OrderDTO } from '../dtos/order.dto';
import { NotFoundException } from '@ecore/domain/common/exceptions';

export class GetOrderQuery implements Query<
  { orderId: string },
  Promise<OrderDTO>
> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderPresenter: Presenter<Order, OrderDTO>,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(GetOrderQuery.name);
  }

  async execute(request: { orderId: string }): Promise<OrderDTO> {
    this.logger.log(`Getting order ${request.orderId}`);
    const order = await this.orderRepository.findById(request.orderId);
    if (!order)
      throw new NotFoundException(`Order ${request.orderId} not found`);
    return this.orderPresenter.toDTO(order);
  }
}
