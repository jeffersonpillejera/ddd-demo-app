import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmOrderHandler } from '../../../application/commands/confirm-order/confirm-order.handler';
import { ConfirmOrderCommand } from '../../../application/commands/confirm-order/confirm-order.command';
import { OrderRepository } from '../../repositories/order.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { LoggerService } from '@ecore/logger/logger.service';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderProxy
  extends ConfirmOrderHandler
  implements ICommandHandler<ConfirmOrderCommand>
{
  constructor(
    orderRepository: OrderRepository,
    eventBusService: EventBusService,
    logger: LoggerService,
  ) {
    super(orderRepository, eventBusService, logger);
  }

  async execute(command: ConfirmOrderCommand): Promise<void> {
    return super.execute(command);
  }
}
