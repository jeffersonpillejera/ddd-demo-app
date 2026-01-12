import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from '@ecore/logger/logger.service';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { ILogger } from '@ecore/domain/core/logger';
import { PlaceOrderCommand } from '../application/commands/place-order.command';
import { SequenceGenerator } from './utils/sequence-generator';
import { OrderRepository } from './repositories/order.repository';
import { ConfirmOrderCommand } from '../application/commands/confirm-order.command';
import { PresentersModule } from './presenters/presenters.module';
import { RepositoriesModule } from './repositories/repository.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import {
  EVENT_PRESENTER_TOKEN,
  MESSAGE_BROKER_CLIENT_NAME,
  EventBusModule,
} from '@ecore/event-bus/event-bus.module';
import { CancelOrderCommand } from '../application/commands/cancel-order.command';
import { GetOrderQuery } from '../application/queries/get-order.query';
import { OrderPresenter } from './presenters/order.presenter';
import { EnvConfigService } from './config/env.service';
import { EnvConfigModule } from './config/env.module';
import { Transport } from '@nestjs/microservices';
import { UtilsModule } from './utils/utils.module';
import { OrderEventPresenter } from './presenters/order-event.presenter';

@Module({
  imports: [
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
})
export class ApplicationProxyModule {
  static PLACE_ORDER_COMMAND = 'PLACE_ORDER_COMMAND';
  static CONFIRM_ORDER_COMMAND = 'CONFIRM_ORDER_COMMAND';
  static CANCEL_ORDER_COMMAND = 'CANCEL_ORDER_COMMAND';
  static GET_ORDER_QUERY = 'GET_ORDER_QUERY';

  static register(): DynamicModule {
    return {
      module: ApplicationProxyModule,
      providers: [
        {
          inject: [
            OrderRepository,
            EventBusService,
            LoggerService,
            SequenceGenerator,
          ],
          provide: this.PLACE_ORDER_COMMAND,
          useFactory: (
            orderRepository: OrderRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
            sequenceGenerator: SequenceGenerator,
          ) =>
            new PlaceOrderCommand(
              orderRepository,
              eventBusService,
              sequenceGenerator,
              loggerService as ILogger,
            ),
        },
        {
          inject: [OrderRepository, EventBusService, LoggerService],
          provide: this.CONFIRM_ORDER_COMMAND,
          useFactory: (
            orderRepository: OrderRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
          ) =>
            new ConfirmOrderCommand(
              orderRepository,
              eventBusService,
              loggerService as ILogger,
            ),
        },
        {
          inject: [OrderRepository, EventBusService, LoggerService],
          provide: this.CANCEL_ORDER_COMMAND,
          useFactory: (
            orderRepository: OrderRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
          ) =>
            new CancelOrderCommand(
              orderRepository,
              eventBusService,
              loggerService as ILogger,
            ),
        },
        {
          inject: [OrderRepository, OrderPresenter, LoggerService],
          provide: this.GET_ORDER_QUERY,
          useFactory: (
            orderRepository: OrderRepository,
            orderPresenter: OrderPresenter,
            loggerService: LoggerService,
          ) =>
            new GetOrderQuery(
              orderRepository,
              orderPresenter,
              loggerService as ILogger,
            ),
        },
      ],
      exports: [
        this.PLACE_ORDER_COMMAND,
        this.CONFIRM_ORDER_COMMAND,
        this.CANCEL_ORDER_COMMAND,
        this.GET_ORDER_QUERY,
      ],
    };
  }
}
