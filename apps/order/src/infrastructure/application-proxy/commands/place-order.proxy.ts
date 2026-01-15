import { PlaceOrderCommand } from '../../../application/commands/place-order/place-order.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../../repositories/order.repository';
import { SequenceGenerator } from '../../utils/sequence-generator';
import { LoggerService } from '@ecore/logger/logger.service';
import { PlaceOrderHandler } from '../../../application/commands/place-order/place-order.handler';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderProxy
  extends PlaceOrderHandler
  implements ICommandHandler<PlaceOrderCommand>
{
  constructor(
    orderRepository: OrderRepository,
    sequenceGenerator: SequenceGenerator,
    logger: LoggerService,
  ) {
    super(orderRepository, sequenceGenerator, logger);
  }

  async execute(command: PlaceOrderCommand): Promise<void> {
    return super.execute(command);
  }
}
