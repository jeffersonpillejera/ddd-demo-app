import { OrderRepository } from '../../../domain/repositories/order.repository';
import { ILogger } from '@ecore/domain/core/logger';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { CommandHandler } from '@ecore/domain/core/cqrs/command.handler';
import { ConfirmOrderCommand } from './confirm-order.command';

export class ConfirmOrderHandler implements CommandHandler<ConfirmOrderCommand> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(command: ConfirmOrderCommand): Promise<void> {
    this.logger.log(`Confirming order ${command.orderId}`);
    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }
    order.confirm();
    await this.orderRepository.save(order);
    this.logger.log(`Order ${command.orderId} confirmed successfully`);
  }
}
