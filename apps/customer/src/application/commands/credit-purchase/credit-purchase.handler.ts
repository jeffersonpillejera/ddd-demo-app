import { type ILogger } from '@ecore/core/logger';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../../domain/repositories/customer.repository';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { Money } from '@ecore/core/common/value-objects/money';
import { CreditPurchaseCommand } from './credit-purchase.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { LOGGER_TOKEN } from '@ecore/logger/constants';

@CommandHandler(CreditPurchaseCommand)
export class CreditPurchaseHandler implements ICommandHandler<CreditPurchaseCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(command: CreditPurchaseCommand): Promise<void> {
    this.logger.log(
      `Credit purchase for customer ${command.creditPurchaseDTO.customerId} for order ${command.creditPurchaseDTO.orderId}`,
    );
    const { customerId, orderId, grandTotal } = command.creditPurchaseDTO;
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }
    customer.creditPurchase(orderId, Money.create(grandTotal));
    await this.customerRepository.save(customer);
    this.logger.log(
      `Credit purchase for customer ${customerId} for order ${orderId} processed`,
    );
  }
}
