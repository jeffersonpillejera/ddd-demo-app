import { DomainEvent } from '@ecore/core/domain-event';
import type { Presenter } from '@ecore/core/presenter';
import { Inject, Injectable } from '@nestjs/common';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Subject } from 'rxjs';
import { EVENT_PRESENTER_TOKEN, MESSAGE_BROKER_TOKEN } from './constants';

@Injectable()
export class EventPublisherService
  implements IEventPublisher<DomainEvent>, IMessageSource<DomainEvent>
{
  private subject$: Subject<DomainEvent> = new Subject<DomainEvent>();

  constructor(
    @Inject(MESSAGE_BROKER_TOKEN)
    private readonly messageBroker: ClientProxy,
    @Inject(EVENT_PRESENTER_TOKEN)
    private readonly eventPresenter: Presenter<DomainEvent, unknown>,
  ) {}

  publish(event: DomainEvent): void {
    // Publish the event within the application
    this.subject$.next(event);

    // Publish the event to other services
    this.messageBroker.emit(event.type, this.eventPresenter.toDTO(event));
  }

  bridgeEventsTo<T extends DomainEvent>(subject: Subject<T>): void {
    this.subject$ = subject as unknown as Subject<DomainEvent>;
  }
}
