import {
  ORDER_REPOSITORY,
  type IOrderRepository,
} from '../../../domain/repositories/order.repository';
import { type ILogger } from '@ecore/core/logger';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { ConfirmOrderCommand } from './confirm-order.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { LOGGER_TOKEN } from '@ecore/logger/constants';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(LOGGER_TOKEN)
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
