import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { ControllersModule } from './controllers/customer.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PersistenceModule } from './persistence/persistence.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EVENT_PRESENTER_TOKEN,
  EventPublisherModule,
} from '@ecore/event-publisher/event-publisher.module';
import { CustomerEventPresenter } from './presenters/customer-event.presenter';
import { PresentersModule } from './presenters/presenters.module';

@Module({
  imports: [
    EnvConfigModule,
    CqrsModule.forRoot(),
    ControllersModule,
    SubscribersModule,
    PersistenceModule,
    EventPublisherModule.forRoot({
      presenterModule: {
        module: PresentersModule,
        providers: [
          {
            provide: EVENT_PRESENTER_TOKEN,
            useExisting: CustomerEventPresenter,
          },
        ],
        exports: [EVENT_PRESENTER_TOKEN],
      },
    }),
  ],
})
export class AppModule {}
