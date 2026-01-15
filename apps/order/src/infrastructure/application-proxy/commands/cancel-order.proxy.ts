import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelOrderHandler } from '../../../application/commands/cancel-order/cancel-order.handler';
import { CancelOrderCommand } from '../../../application/commands/cancel-order/cancel-order.command';
import { OrderRepository } from '../../repositories/order.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { LoggerService } from '@ecore/logger/logger.service';

@CommandHandler(CancelOrderCommand)
export class CancelOrderProxy
  extends CancelOrderHandler
  implements ICommandHandler<CancelOrderCommand>
{
  constructor(
    orderRepository: OrderRepository,
    eventBusService: EventBusService,
    logger: LoggerService,
  ) {
    super(orderRepository, eventBusService, logger);
  }

  async execute(command: CancelOrderCommand): Promise<void> {
    return super.execute(command);
  }
}
