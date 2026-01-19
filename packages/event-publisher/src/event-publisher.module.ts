import { DynamicModule, Module, OnModuleInit, Type } from '@nestjs/common';
import { EventPublisherEnvService } from './event-publisher-env.service';
import { validate } from './event-publisher-env.validation';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventPublisherService } from './event-publisher.service';
import { EventBus, IEventPublisher } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { DomainEvent } from '@ecore/domain/core/domain-event';

export const EVENT_PRESENTER_TOKEN = 'EVENT_PRESENTER';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validate }),
    ClientsModule.registerAsync([
      {
        name: 'MESSAGE_BROKER',
        useFactory: (envConfigService: EventPublisherEnvService) => ({
          transport: Transport.REDIS,
          options: { ...envConfigService.eventPublisher },
        }),
        inject: [EventPublisherEnvService],
      },
    ]),
  ],
  providers: [EventPublisherEnvService, EventPublisherService],
  exports: [EventPublisherEnvService, EventPublisherService],
})
class EventPublisherModulePrivate implements OnModuleInit {
  constructor(
    private readonly eventPublisher: EventPublisherService,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit(): void {
    this.eventPublisher.bridgeEventsTo(
      this.eventBus.subject$ as Subject<DomainEvent>,
    );
    this.eventBus.publisher = this
      .eventPublisher as IEventPublisher<DomainEvent>;
  }
}

@Module({})
export class EventPublisherModule {
  static forRoot({
    presenterModule,
  }: {
    presenterModule: Type<any> | DynamicModule;
  }): DynamicModule {
    return {
      module: EventPublisherModulePrivate,
      imports: [presenterModule],
      global: true,
    };
  }
}
