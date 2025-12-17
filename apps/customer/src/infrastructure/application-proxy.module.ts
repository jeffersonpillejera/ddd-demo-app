import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories/repositories.module';
import { EventBusModule } from '@ecore/event-bus/event-bus.module';
import { CustomerRepository } from './repositories/customer.repository';
import { EventBusService } from '@ecore/event-bus/event-bus.service';
import { CustomerPresenter } from './presenters/customer.presenter';
import { RegisterUserHandler } from '../application/commands/register-user/register-user.handler';
import { GetCustomerHandler } from '../application/queries/get-customer/get-customer.handler';
import { PresentersModule } from './presenters/presenters.module';

@Module({ imports: [RepositoriesModule, EventBusModule, PresentersModule] })
export class ApplicationProxyModule {
  static REGISTER_USER_COMMAND = 'REGISTER_USER_COMMAND';
  static GET_CUSTOMER_QUERY = 'GET_CUSTOMER_QUERY';

  static register(): DynamicModule {
    return {
      module: ApplicationProxyModule,
      providers: [
        {
          inject: [CustomerRepository, EventBusService, CustomerPresenter],
          provide: this.REGISTER_USER_COMMAND,
          useFactory: (
            customerRepository: CustomerRepository,
            eventBusService: EventBusService,
            customerPresenter: CustomerPresenter,
          ) =>
            new RegisterUserHandler(
              customerRepository,
              eventBusService,
              customerPresenter,
            ),
        },
        {
          inject: [CustomerRepository, CustomerPresenter],
          provide: this.GET_CUSTOMER_QUERY,
          useFactory: (
            customerRepository: CustomerRepository,
            customerPresenter: CustomerPresenter,
          ) => new GetCustomerHandler(customerRepository, customerPresenter),
        },
      ],
      exports: [this.REGISTER_USER_COMMAND, this.GET_CUSTOMER_QUERY],
    };
  }
}
