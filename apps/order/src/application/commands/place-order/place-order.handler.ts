import {
  ORDER_REPOSITORY,
  type IOrderRepository,
} from '../../../domain/repositories/order.repository';
import { type ILogger } from '@ecore/core/logger';
import { type SequenceGenerator } from '@ecore/core/sequence-generator';
import {
  Order,
  ORDER_ID_PREFIX,
  ORDER_STATUS,
} from '../../../domain/models/order';
import { OrderItem } from '../../../domain/models/order-item';
import { Money } from '@ecore/core/common/value-objects/money';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './place-order.command';
import { Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@ecore/logger/constants';
import { SEQUENCE_GENERATOR_TOKEN } from '@ecore/core/sequence-generator';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(SEQUENCE_GENERATOR_TOKEN)
    private readonly sequenceGenerator: SequenceGenerator,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(command: PlaceOrderCommand): Promise<void> {
    this.logger.log(
      `Placing order for customer ${command.placeOrderDTO.customerId}`,
    );

    const {
      customerId,
      discount,
      totalTax,
      subTotal,
      grandTotal,
      currency,
      items,
    } = command.placeOrderDTO;

    const orderId = await this.sequenceGenerator.generateId(ORDER_ID_PREFIX);

    const order = Order.create(
      {
        customerId,
        status: ORDER_STATUS.PENDING,
        dateOrdered: new Date(),
        discount: Money.create({ amount: discount, currency }),
        totalTax: Money.create({ amount: totalTax, currency }),
        subTotal: Money.create({ amount: subTotal, currency }),
        grandTotal: Money.create({ amount: grandTotal, currency }),
        items: items.map((item) =>
          OrderItem.create({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Money.create({ amount: item.unitPrice, currency }),
          }),
        ),
      },
      orderId,
    );

    await this.orderRepository.save(order);
    this.logger.log(`Order ${orderId.toString()} placed successfully`);
  }
}
