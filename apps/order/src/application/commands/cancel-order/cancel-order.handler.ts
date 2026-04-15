import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ORDER_REPOSITORY,
  type IOrderRepository,
} from '../../../domain/repositories/order.repository';
import { type ILogger } from '@ecore/core/logger';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { CancelOrderCommand } from './cancel-order.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { LOGGER_TOKEN } from '@ecore/logger/constants';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(LOGGER_TOKEN)
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
