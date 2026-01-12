import { AggregateRoot } from '@ecore/domain/core/aggregate-root';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { EventBus } from '@nestjs/cqrs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Presenter } from '@ecore/domain/core/presenter';
import { DomainEvent } from '@ecore/domain/core/domain-event';

@Injectable()
export class EventBusService implements DomainEventBus {
  constructor(
    private readonly eventBus: EventBus,
    @Optional()
    @Inject('MESSAGE_BROKER')
    private readonly messageBroker?: ClientProxy,
    @Optional()
    @Inject('EVENT_PRESENTER')
    private readonly presenter?: Presenter<DomainEvent, any>,
  ) {}
  publish<T extends AggregateRoot<any>>(aggregateRoot: T): void {
    aggregateRoot.domainEvents.forEach((domainEvent) => {
      this.eventBus.publish(domainEvent);
      if (this.messageBroker && this.presenter) {
        this.messageBroker.emit(
          domainEvent.constructor.name,
          this.presenter.toDTO(domainEvent),
        );
      }
    });
    aggregateRoot.clearDomainEvents();
  }
}
