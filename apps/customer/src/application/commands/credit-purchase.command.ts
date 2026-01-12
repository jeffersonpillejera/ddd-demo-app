import { ILogger } from '@ecore/domain/core/logger';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { Command } from '@ecore/domain/core/cqrs/command';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { CreditPurchaseDTO } from '../dtos/customer.dto';
import { Money } from '@ecore/domain/common/value-objects/money';

export class CreditPurchaseCommand implements Command<CreditPurchaseDTO> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly domainEventBus: DomainEventBus,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(request: CreditPurchaseDTO) {
    const { customerId, orderId, grandTotal } = request;
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
