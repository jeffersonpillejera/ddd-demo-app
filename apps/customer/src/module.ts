import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/config/env.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventPublisherModule } from '@ecore/event-publisher/event-publisher.module';
import { PresentersModule } from './infrastructure/presenters/presenters.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { CreateCustomerHandler } from './application/commands/create-customer/create-customer.handler';
import { CreditPurchaseHandler } from './application/commands/credit-purchase/credit-purchase.handler';
import { GetCustomerHandler } from './application/queries/get-customer/get-customer.handler';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository';
import { CustomerDataMapper } from './infrastructure/data-mappers/customer.data-mapper';
import { AllCustomerEventsHandler } from './infrastructure/subscribers/all-customer-events.handler';

@Module({
  imports: [
    EnvConfigModule,
    CqrsModule.forRoot(),
    PersistenceModule,
    PresentersModule,
    EventPublisherModule.register({ presenterModule: PresentersModule }),
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'CustomerService',
    }),
  ],
  providers: [
    CustomerDataMapper,
    CustomerRepository,
    { provide: CUSTOMER_REPOSITORY, useExisting: CustomerRepository },
    CreateCustomerHandler,
    CreditPurchaseHandler,
    GetCustomerHandler,
    AllCustomerEventsHandler,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
