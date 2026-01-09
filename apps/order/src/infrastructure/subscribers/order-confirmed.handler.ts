import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { LoggerService } from '@ecore/logger/logger.service';
import { OrderProjectionRebuilder } from '../projection-store/order.projection-rebuilder';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedHandler implements IEventHandler<OrderConfirmedEvent> {
  constructor(
    private readonly logger: LoggerService,
    private readonly orderProjectionRebuilder: OrderProjectionRebuilder,
  ) {
    this.logger.setContext(OrderConfirmedHandler.name);
  }

  async handle(event: OrderConfirmedEvent): Promise<void> {
    this.logger.log(
      `Order ${event.orderId.toString()} confirmed, projecting to projection store`,
    );

    await this.orderProjectionRebuilder.rebuild(event);

    this.logger.log(
      `Order ${event.orderId.toString()} confirmed, projected to projection store`,
    );
  }
}
