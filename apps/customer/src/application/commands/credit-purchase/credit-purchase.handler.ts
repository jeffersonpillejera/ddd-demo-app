import { ILogger } from '@ecore/domain/core/logger';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { Money } from '@ecore/domain/common/value-objects/money';
import { CreditPurchaseCommand } from './credit-purchase.command';
import { CommandHandler } from '@ecore/domain/core/cqrs/command.handler';

export class CreditPurchaseHandler implements CommandHandler<CreditPurchaseCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly domainEventBus: DomainEventBus,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(command: CreditPurchaseCommand): Promise<void> {
    const { customerId, orderId, grandTotal } = command.creditPurchaseDTO;
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }
    customer.creditPurchase(orderId, Money.create(grandTotal));
    await this.customerRepository.save(customer);
    this.domainEventBus.publish(customer);
    this.logger.log(
      `Credit purchase for customer ${customerId} processed for order ${orderId}`,
    );
  }
}
