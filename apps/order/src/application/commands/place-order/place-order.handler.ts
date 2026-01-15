import { OrderRepository } from '../../../domain/repositories/order.repository';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { ILogger } from '@ecore/domain/core/logger';
import { SequenceGenerator } from '@ecore/domain/core/sequence-generator';
import {
  Order,
  ORDER_ID_PREFIX,
  ORDER_STATUS,
} from '../../../domain/models/order';
import { OrderItem } from '../../../domain/models/order-item';
import { Money } from '@ecore/domain/common/value-objects/money';
import { CommandHandler } from '@ecore/domain/core/cqrs/command.handler';
import { PlaceOrderCommand } from './place-order.command';

export class PlaceOrderHandler implements CommandHandler<PlaceOrderCommand> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly domainEventBus: DomainEventBus,
    private readonly sequenceGenerator: SequenceGenerator,
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
    this.domainEventBus.publish(order);
    this.logger.log(`Order ${orderId.toString()} placed successfully`);
  }
}
