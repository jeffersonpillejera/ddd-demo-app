import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { OrderProjectionRebuilder } from '../projection-store/order.projection-rebuilder';
import { LoggerService } from '@ecore/logger/logger.service';

@EventsHandler(OrderCancelledEvent)
export class OrderCancelledHandler implements IEventHandler<OrderCancelledEvent> {
  constructor(
    private readonly logger: LoggerService,
    private readonly orderProjectionRebuilder: OrderProjectionRebuilder,
  ) {
    this.logger.setContext(OrderCancelledHandler.name);
  }

  async handle(event: OrderCancelledEvent): Promise<void> {
    this.logger.log(
      `Order ${event.orderId.toString()} canceled, projecting to projection store`,
    );

    await this.orderProjectionRebuilder.rebuild(event);

    this.logger.log(`Order ${event.orderId.toString()} projected successfully`);
  }
}
