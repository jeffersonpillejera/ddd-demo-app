import { Command } from '@ecore/domain/core/cqrs/command';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { ILogger } from '@ecore/domain/core/logger';
import { NotFoundException } from '@ecore/domain/common/exceptions';

export class CancelOrderCommand implements Command<{ orderId: string }> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly domainEventBus: DomainEventBus,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(CancelOrderCommand.name);
  }

  async execute(request: { orderId: string }): Promise<void> {
    this.logger.log(`Cancelling order ${request.orderId}`);
    const order = await this.orderRepository.findById(request.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${request.orderId} not found`);
    }
    order.cancel();
    await this.orderRepository.save(order);
    this.domainEventBus.publish(order);
    this.logger.log(`Order ${request.orderId} cancelled successfully`);
  }
}
