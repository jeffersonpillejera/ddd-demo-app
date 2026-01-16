import { CommandHandler } from '@ecore/domain/core/cqrs/command.handler';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { ILogger } from '@ecore/domain/core/logger';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { CancelOrderCommand } from './cancel-order.command';

export class CancelOrderHandler implements CommandHandler<CancelOrderCommand> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(command: CancelOrderCommand): Promise<void> {
    this.logger.log(`Cancelling order ${command.orderId}`);
    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }
    order.cancel();
    await this.orderRepository.save(order);
    this.logger.log(`Order ${command.orderId} cancelled successfully`);
  }
}
