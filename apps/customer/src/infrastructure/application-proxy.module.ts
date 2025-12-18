import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories/repositories.module';
import { EventBusModule } from '@ecore/event-bus/event-bus.module';
import { CustomerRepository } from './repositories/customer.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { CustomerPresenter } from './presenters/customer.presenter';
import { RegisterUserHandler } from '../application/commands/register-user/register-user.handler';
import { GetCustomerHandler } from '../application/queries/get-customer/get-customer.handler';
import { PresentersModule } from './presenters/presenters.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import { LoggerService } from '@ecore/logger/logger.service';
import { ILogger } from '@ecore/domain/core/logger';

@Module({
  imports: [
    RepositoriesModule,
    EventBusModule,
    PresentersModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'CustomerService',
    }),
  ],
})
export class ApplicationProxyModule {
  static REGISTER_USER_COMMAND = 'REGISTER_USER_COMMAND';
  static GET_CUSTOMER_QUERY = 'GET_CUSTOMER_QUERY';

  static register(): DynamicModule {
    return {
      module: ApplicationProxyModule,
      providers: [
        {
          inject: [CustomerRepository, EventBusService, LoggerService],
          provide: this.REGISTER_USER_COMMAND,
          useFactory: (
            customerRepository: CustomerRepository,
            eventBusService: EventBusService,
            loggerService: LoggerService,
          ) =>
            new RegisterUserHandler(
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
            new GetCustomerHandler(
              customerRepository,
              customerPresenter,
              loggerService as ILogger,
            ),
        },
      ],
      exports: [this.REGISTER_USER_COMMAND, this.GET_CUSTOMER_QUERY],
    };
  }
}
