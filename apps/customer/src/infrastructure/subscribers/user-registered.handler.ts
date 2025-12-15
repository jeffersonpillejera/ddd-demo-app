import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent): void {
    console.log(`User registered: ${event.customer.id.toString()}`);
  }
}
