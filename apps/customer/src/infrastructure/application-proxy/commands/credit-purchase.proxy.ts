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
  constructor(customerRepository: CustomerRepository, logger: LoggerService) {
    super(customerRepository, logger);
  }

  async execute(command: CreditPurchaseCommand): Promise<void> {
    return super.execute(command);
  }
}
