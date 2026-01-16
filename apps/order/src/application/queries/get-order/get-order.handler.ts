import { Order } from '../../../domain/models/order';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Presenter } from '@ecore/domain/core/presenter';
import { ILogger } from '@ecore/domain/core/logger';
import { OrderDTO } from '../../dtos/order.dto';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { GetOrderQuery } from './get-order.query';
import { QueryHandler } from '@ecore/domain/core/cqrs/query.handler';

export class GetOrderHandler implements QueryHandler<GetOrderQuery, OrderDTO> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderPresenter: Presenter<Order, OrderDTO>,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetOrderQuery): Promise<OrderDTO> {
    this.logger.log(`Getting order ${query.orderId}`);
    const order = await this.orderRepository.findById(query.orderId);
    if (!order) throw new NotFoundException(`Order ${query.orderId} not found`);
    return this.orderPresenter.toDTO(order);
  }
}
