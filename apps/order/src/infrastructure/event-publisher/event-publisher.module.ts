import { Module, OnModuleInit } from '@nestjs/common';
import { EventPublisher } from './event-publisher';
import { EventBus, IEventPublisher } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvConfigService } from '../config/env.service';
import { EnvConfigModule } from '../config/env.module';
import { DomainEvent } from '@ecore/domain/core/domain-event';
import { Subject } from 'rxjs';

@Module({
  imports: [
    // CqrsModule.forRoot(),
    ClientsModule.registerAsync([
      {
        imports: [EnvConfigModule],
        name: 'MESSAGE_BROKER',
        useFactory: (envConfigService: EnvConfigService) => ({
          transport: Transport.REDIS,
          options: { ...envConfigService.eventBus },
        }),
        inject: [EnvConfigService],
      },
    ]),
  ],
  providers: [EventPublisher],
  exports: [EventPublisher],
})
export class EventPublisherModule implements OnModuleInit {
  constructor(
    private readonly eventPublisher: EventPublisher,
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
