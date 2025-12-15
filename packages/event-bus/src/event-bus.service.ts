import { AggregateRoot } from '@ecore/domain/core/aggregate-root';
import { IDomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventBusService implements IDomainEventBus {
  constructor(private readonly eventBus: EventBus) {}
  publish<T extends AggregateRoot<any>>(aggregateRoot: T): void {
    aggregateRoot.domainEvents.forEach((domainEvent) => {
      this.eventBus.publish(domainEvent);
    });
    aggregateRoot.clearDomainEvents();
  }
}
