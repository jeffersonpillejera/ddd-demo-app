import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@ecore/logger/logger.service';

@EventsHandler(CustomerCreatedEvent)
export class CustomerCreatedHandler implements IEventHandler<CustomerCreatedEvent> {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CustomerCreatedHandler.name);
  }

  handle(event: CustomerCreatedEvent): void {
    this.logger.log(`Customer created: ${event.customerId.toString()}`);
  }
}
