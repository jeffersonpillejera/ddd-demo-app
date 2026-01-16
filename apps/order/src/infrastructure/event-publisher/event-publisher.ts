import { DomainEvent } from '@ecore/domain/core/domain-event';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { OrderEventPresenter } from '../presenters/order-event.presenter';
import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ORDER_EVENTS } from '../../domain/models/order';

@Injectable()
export class EventPublisher
  implements
    IEventPublisher<DomainEvent>,
    IMessageSource<DomainEvent>,
    OnModuleInit
{
  private subject$: Subject<DomainEvent> = new Subject<DomainEvent>();
  private orderEventPresenter: OrderEventPresenter;

  constructor(
    @Inject('MESSAGE_BROKER')
    private readonly messageBroker: ClientProxy,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.orderEventPresenter = this.moduleRef.get(OrderEventPresenter, {
      strict: false,
    });
  }

  publish(event: DomainEvent): void {
    let eventToPublish;

    // Publish the event within the application
    this.subject$.next(event);

    if (ORDER_EVENTS.includes(event.type) && this.orderEventPresenter) {
      eventToPublish = this.orderEventPresenter.toDTO(event);
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
