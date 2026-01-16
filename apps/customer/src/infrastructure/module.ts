import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { ControllersModule } from './controllers/customer.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PersistenceModule } from './persistence/persistence.module';
import { EventPublisherModule } from './event-publisher/event-publisher.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    EnvConfigModule,
    CqrsModule.forRoot(),
    ControllersModule,
    SubscribersModule,
    PersistenceModule,
    EventPublisherModule,
  ],
})
export class AppModule {}
