import { DomainEvent } from '@ecore/domain/core/domain-event';
import type { Presenter } from '@ecore/domain/core/presenter';
import { Inject, Injectable } from '@nestjs/common';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Subject } from 'rxjs';

@Injectable()
export class EventPublisherService
  implements IEventPublisher<DomainEvent>, IMessageSource<DomainEvent>
{
  private subject$: Subject<DomainEvent> = new Subject<DomainEvent>();

  constructor(
    @Inject('MESSAGE_BROKER')
    private readonly messageBroker: ClientProxy,
    @Inject('EVENT_PRESENTER')
    private readonly eventPresenter: Presenter<DomainEvent, unknown>,
  ) {}

  publish(event: DomainEvent): void {
    // Publish the event within the application
    this.subject$.next(event);

    // Publish the event to other services
    this.messageBroker.emit(event.type, this.eventPresenter.toDTO(event));
  }

  bridgeEventsTo(subject: Subject<DomainEvent>): void {
    this.subject$ = subject;
  }
}
