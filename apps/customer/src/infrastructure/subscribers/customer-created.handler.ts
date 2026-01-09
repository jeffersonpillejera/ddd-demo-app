import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(CustomerCreatedEvent)
export class CustomerCreatedHandler implements IEventHandler<CustomerCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log(`Customer created: ${event.customer.id.toString()}`);
  }
}
