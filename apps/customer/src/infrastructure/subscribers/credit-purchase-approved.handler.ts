import { CreditPurchaseApprovedEvent } from '../../domain/events/credit-purchase-approved.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@ecore/logger/logger.service';

@EventsHandler(CreditPurchaseApprovedEvent)
export class CreditPurchaseApprovedHandler implements IEventHandler<CreditPurchaseApprovedEvent> {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CreditPurchaseApprovedHandler.name);
  }

  handle(event: CreditPurchaseApprovedEvent): void {
    this.logger.log(
      `Credit purchase approved for customer ${event.customerId.toString()} for order ${event.orderId.toString()}`,
    );
  }
}
