import { Module } from '@nestjs/common';
import { CreateCustomerProxy } from './commands/create-customer.proxy';
import { CreditPurchaseProxy } from './commands/credit-purchase.proxy';
import { GetCustomerProxy } from './query/get-customer.proxy';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoriesModule } from '../repositories/repositories.module';
import { EnvConfigModule } from '../config/env.module';
import { Transport } from '@nestjs/microservices';
import { EventBusModule } from '@ecore/event-bus/event-bus.module';
import { MESSAGE_BROKER_CLIENT_NAME } from '@ecore/event-bus/event-bus.module';
import { EnvConfigService } from '../config/env.service';
import { PresentersModule } from '../presenters/presenters.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import { EVENT_PRESENTER_TOKEN } from '@ecore/event-bus/event-bus.module';
import { CustomerEventPresenter } from '../presenters/customer-event.presenter';

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
  providers: [CreateCustomerProxy, CreditPurchaseProxy, GetCustomerProxy],
  exports: [CreateCustomerProxy, CreditPurchaseProxy, GetCustomerProxy],
})
export class ApplicationProxyModule {}
