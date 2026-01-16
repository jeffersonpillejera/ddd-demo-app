import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmOrderHandler } from '../../../application/commands/confirm-order/confirm-order.handler';
import { ConfirmOrderCommand } from '../../../application/commands/confirm-order/confirm-order.command';
import { OrderRepository } from '../../repositories/order.repository';
import { LoggerService } from '@ecore/logger/logger.service';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderProxy
  extends ConfirmOrderHandler
  implements ICommandHandler<ConfirmOrderCommand>
{
  constructor(orderRepository: OrderRepository, logger: LoggerService) {
    super(orderRepository, logger);
  }

  async execute(command: ConfirmOrderCommand): Promise<void> {
    return super.execute(command);
  }
}
