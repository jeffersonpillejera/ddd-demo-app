import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../../../application/commands/create-customer/create-customer.command';
import { CreateCustomerHandler } from '../../../application/commands/create-customer/create-customer.handler';
import { CustomerRepository } from '../../repositories/customer.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { LoggerService } from '@ecore/logger/logger.service';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerProxy
  extends CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  constructor(
    customerRepository: CustomerRepository,
    eventBusService: EventBusService,
    logger: LoggerService,
  ) {
    super(customerRepository, eventBusService, logger);
  }

  async execute(command: CreateCustomerCommand): Promise<void> {
    return super.execute(command);
  }
}
