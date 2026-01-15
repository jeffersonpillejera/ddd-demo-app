import { Module } from '@nestjs/common';
import { PlaceOrderProxy } from './commands/place-order.proxy';
import { ConfirmOrderProxy } from './commands/confirm-order.proxy';
import { CancelOrderProxy } from './commands/cancel-order.proxy';
import { GetOrderProxy } from './queries/get-order.proxy';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from '@ecore/logger/logger.module';
import { RepositoriesModule } from '../repositories/repository.module';
import {
  EVENT_PRESENTER_TOKEN,
  EventBusModule,
} from '@ecore/event-bus/event-bus.module';
import { MESSAGE_BROKER_CLIENT_NAME } from '@ecore/event-bus/event-bus.module';
import { EnvConfigModule } from '../config/env.module';
import { EnvConfigService } from '../config/env.service';
import { Transport } from '@nestjs/microservices';
import { OrderEventPresenter } from '../presenters/order-event.presenter';
import { PresentersModule } from '../presenters/presenters.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    CqrsModule,
    RepositoriesModule,
    EventBusModule.register({
      clientProviderOptions: {
        imports: [EnvConfigModule],
        name: MESSAGE_BROKER_CLIENT_NAME,
        useFactory: (envConfigService: EnvConfigService) => ({
          transport: Transport.REDIS,
          options: { ...envConfigService.eventBus },
        }),
        inject: [EnvConfigService],
      },
      presenterModule: {
        module: PresentersModule,
        providers: [
          { provide: EVENT_PRESENTER_TOKEN, useExisting: OrderEventPresenter },
        ],
        exports: [EVENT_PRESENTER_TOKEN],
      },
    }),
    PresentersModule,
    UtilsModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  ],
  providers: [
    PlaceOrderProxy,
    ConfirmOrderProxy,
    CancelOrderProxy,
    GetOrderProxy,
  ],
  exports: [
    PlaceOrderProxy,
    ConfirmOrderProxy,
    CancelOrderProxy,
    GetOrderProxy,
  ],
})
export class ApplicationProxyModule {}
