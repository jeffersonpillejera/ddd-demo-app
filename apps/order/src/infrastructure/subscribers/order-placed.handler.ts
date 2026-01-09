import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { LoggerService } from '@ecore/logger/logger.service';
import { OrderProjectionRebuilder } from '../projection-store/order.projection-rebuilder';

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedHandler implements IEventHandler<OrderPlacedEvent> {
  constructor(
    private readonly logger: LoggerService,
    private readonly orderProjectionRebuilder: OrderProjectionRebuilder,
  ) {
    this.logger.setContext(OrderPlacedHandler.name);
  }

  async handle(event: OrderPlacedEvent): Promise<void> {
    this.logger.log(
      `Order ${event.orderId.toString()} placed, projecting to projection store`,
    );

    await this.orderProjectionRebuilder.rebuild(event);

    this.logger.log(`Order ${event.orderId.toString()} projected successfully`);
  }
}
