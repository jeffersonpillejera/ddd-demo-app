import { DomainEvent } from '@ecore/domain/core/domain-event';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CustomerEventPresenter } from '../presenters/customer-event.presenter';
import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CUSTOMER_EVENTS } from '../../domain/models/customer';

@Injectable()
export class EventPublisher
  implements
    IEventPublisher<DomainEvent>,
    IMessageSource<DomainEvent>,
    OnModuleInit
{
  private subject$: Subject<DomainEvent> = new Subject<DomainEvent>();
  private customerEventPresenter: CustomerEventPresenter;

  constructor(
    @Inject('MESSAGE_BROKER')
    private readonly messageBroker: ClientProxy,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.customerEventPresenter = this.moduleRef.get(CustomerEventPresenter, {
      strict: false,
    });
  }

  publish(event: DomainEvent): void {
    let eventToPublish;

    // Publish the event within the application
    this.subject$.next(event);

    if (CUSTOMER_EVENTS.includes(event.type) && this.customerEventPresenter) {
      eventToPublish = this.customerEventPresenter.toDTO(event);
    }

    if (eventToPublish) {
      // Publish the event to other services
      this.messageBroker.emit(event.type, eventToPublish);
    }
  }

  bridgeEventsTo(subject: Subject<DomainEvent>): void {
    this.subject$ = subject;
  }
}
