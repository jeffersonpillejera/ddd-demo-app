import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from './config/env.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ControllersModule } from './controllers/controller.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EVENT_PRESENTER_TOKEN,
  EventPublisherModule,
} from '@ecore/event-publisher/event-publisher.module';
import { OrderEventPresenter } from './presenters/order-event.presenter';
import { PresentersModule } from './presenters/presenters.module';

@Module({
  imports: [
    EnvConfigModule,
    CqrsModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [EnvConfigModule],
      useFactory: (envConfigService: EnvConfigService) => ({
        uri: envConfigService.database.eventStoreUrl,
      }),
      inject: [EnvConfigService],
    }),
    SubscribersModule,
    ControllersModule,
    EventPublisherModule.forRoot({
      presenterModule: {
        module: PresentersModule,
        providers: [
          { provide: EVENT_PRESENTER_TOKEN, useExisting: OrderEventPresenter },
        ],
        exports: [EVENT_PRESENTER_TOKEN],
      },
    }),
  ],
})
export class AppModule {}
