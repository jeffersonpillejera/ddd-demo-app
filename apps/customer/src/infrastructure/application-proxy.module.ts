import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories/repositories.module';
import { CustomerRepository } from './repositories/customer.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { CustomerPresenter } from './presenters/customer.presenter';
import { CreateCustomerCommand } from '../application/commands/create-customer.command';
import { GetCustomerQuery } from '../application/queries/get-customer.query';
import { PresentersModule } from './presenters/presenters.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import { LoggerService } from '@ecore/logger/logger.service';
import { ILogger } from '@ecore/domain/core/logger';
import { CreditPurchaseCommand } from '../application/commands/credit-purchase.command';
import { Transport } from '@nestjs/microservices';
import { EnvConfigService } from './config/env.service';
import { EnvConfigModule } from './config/env.module';
import {
  EVENT_PRESENTER_TOKEN,
  MESSAGE_BROKER_CLIENT_NAME,
  EventBusModule,
} from '@ecore/event-bus/event-bus.module';
import { CustomerEventPresenter } from './presenters/customer-event.presenter';

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
          {
            provide: EVENT_PRESENTER_TOKEN,
            useExisting: CustomerEventPresenter,
          },
        ],
        exports: [EVENT_PRESENTER_TOKEN],
      },
    }),
    PresentersModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'CustomerService',
    }),
  ],
})
export class ApplicationProxyModule {
  static CREATE_CUSTOMER_COMMAND = 'CREATE_CUSTOMER_COMMAND';
  static GET_CUSTOMER_QUERY = 'GET_CUSTOMER_QUERY';
  static CREDIT_PURCHASE_COMMAND = 'CREDIT_PURCHASE_COMMAND';

  static register(): DynamicModule {
    return {
      module: ApplicationProxyModule,
      providers: [
        {
          inject: [CustomerRepository, EventBusService, LoggerService],
          provide: this.CREATE_CUSTOMER_COMMAND,
          useFactory: (
            customerRepository: CustomerRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
          ) =>
            new CreateCustomerCommand(
              customerRepository,
              eventBusService,
              loggerService as ILogger,
            ),
        },
        {
          inject: [CustomerRepository, EventBusService, LoggerService],
          provide: this.CREDIT_PURCHASE_COMMAND,
          useFactory: (
            customerRepository: CustomerRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
          ) =>
            new CreditPurchaseCommand(
              customerRepository,
              eventBusService,
              loggerService as ILogger,
            ),
        },
        {
          inject: [CustomerRepository, CustomerPresenter, LoggerService],
          provide: this.GET_CUSTOMER_QUERY,
          useFactory: (
            customerRepository: CustomerRepository,
            customerPresenter: CustomerPresenter,
            loggerService: LoggerService,
          ) =>
            new GetCustomerQuery(
              customerRepository,
              customerPresenter,
              loggerService as ILogger,
            ),
        },
      ],
      exports: [
        this.CREATE_CUSTOMER_COMMAND,
        this.GET_CUSTOMER_QUERY,
        this.CREDIT_PURCHASE_COMMAND,
      ],
    };
  }
}
