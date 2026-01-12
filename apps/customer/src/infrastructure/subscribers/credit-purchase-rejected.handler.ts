import { CreditPurchaseRejectedEvent } from '../../domain/events/credit-purchase-rejected.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@ecore/logger/logger.service';

@EventsHandler(CreditPurchaseRejectedEvent)
export class CreditPurchaseRejectedHandler implements IEventHandler<CreditPurchaseRejectedEvent> {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CreditPurchaseRejectedHandler.name);
  }

  handle(event: CreditPurchaseRejectedEvent): void {
    this.logger.log(
      `Credit purchase rejected for customer ${event.customerId.toString()} for order ${event.orderId.toString()}`,
    );
  }
}
