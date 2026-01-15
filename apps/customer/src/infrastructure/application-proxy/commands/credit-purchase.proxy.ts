import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { CreditPurchaseHandler } from '../../../application/commands/credit-purchase/credit-purchase.handler';
import { CustomerRepository } from '../../repositories/customer.repository';
import { LoggerService } from '@ecore/logger/logger.service';
import { CreditPurchaseCommand } from '../../../application/commands/credit-purchase/credit-purchase.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreditPurchaseCommand)
export class CreditPurchaseProxy
  extends CreditPurchaseHandler
  implements ICommandHandler<CreditPurchaseCommand>
{
  constructor(
    customerRepository: CustomerRepository,
    eventBusService: EventBusService,
    logger: LoggerService,
  ) {
    super(customerRepository, eventBusService, logger);
  }

  async execute(command: CreditPurchaseCommand): Promise<void> {
    return super.execute(command);
  }
}
