import { Order, ORDER_PRESENTER } from '../../../domain/models/order';
import {
  ORDER_REPOSITORY,
  type IOrderRepository,
} from '../../../domain/repositories/order.repository';
import { type Presenter } from '@ecore/core/presenter';
import { type ILogger } from '@ecore/core/logger';
import { IOrderDTO } from '../../dto.interface';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { GetOrderQuery } from './get-order.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@ecore/logger/constants';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<
  GetOrderQuery,
  IOrderDTO
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(ORDER_PRESENTER)
    private readonly orderPresenter: Presenter<Order, IOrderDTO>,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetOrderQuery): Promise<IOrderDTO> {
    this.logger.log(`Getting order ${query.orderId}`);
    const order = await this.orderRepository.findById(query.orderId);
    if (!order) throw new NotFoundException(`Order ${query.orderId} not found`);
    return this.orderPresenter.toDTO(order);
  }
}
