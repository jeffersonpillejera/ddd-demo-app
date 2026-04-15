import { DynamicModule, Module, OnModuleInit, Type } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventPublisherService } from './event-publisher.service';
import { EventBus, IEventPublisher } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { DomainEvent } from '@ecore/core/domain-event';
import { MESSAGE_BROKER_TOKEN } from './constants';
import { validate } from './config.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validate }),
    ClientsModule.register([
      {
        name: MESSAGE_BROKER_TOKEN,
        transport: Transport.REDIS,
        options: {
          host: process.env.EVENT_PUBLISHER_HOST!,
          port: parseInt(process.env.EVENT_PUBLISHER_PORT!, 10),
        },
      },
    ]),
  ],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
class EventPublisherModulePrivate implements OnModuleInit {
  constructor(
    private readonly eventPublisher: EventPublisherService,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit(): void {
    this.eventPublisher.bridgeEventsTo(
      this.eventBus.subject$ as unknown as Subject<DomainEvent>,
    );
    this.eventBus.publisher = this
      .eventPublisher as IEventPublisher<DomainEvent>;
  }
}

@Module({})
export class EventPublisherModule {
  static register({
    presenterModule,
  }: {
    presenterModule: Type<any> | DynamicModule;
  }): DynamicModule {
    return { module: EventPublisherModulePrivate, imports: [presenterModule] };
  }
}
