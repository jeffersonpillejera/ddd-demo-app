import { OrderRepository } from '../../repositories/order.repository';
import { OrderPresenter } from '../../presenters/order.presenter';
import { LoggerService } from '@ecore/logger/logger.service';
import { GetOrderHandler } from '../../../application/queries/get-order/get-order.handler';
import { GetOrderQuery } from '../../../application/queries/get-order/get-order.query';
import { OrderDTO } from '../../../application/dtos/order.dto';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetOrderQuery)
export class GetOrderProxy
  extends GetOrderHandler
  implements IQueryHandler<GetOrderQuery, OrderDTO>
{
  constructor(
    orderRepository: OrderRepository,
    orderPresenter: OrderPresenter,
    logger: LoggerService,
  ) {
    super(orderRepository, orderPresenter, logger);
  }

  async execute(query: GetOrderQuery): Promise<OrderDTO> {
    return super.execute(query);
  }
}
