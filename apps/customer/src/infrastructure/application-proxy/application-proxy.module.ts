import { Module } from '@nestjs/common';
import { CreateCustomerProxy } from './commands/create-customer.proxy';
import { CreditPurchaseProxy } from './commands/credit-purchase.proxy';
import { GetCustomerProxy } from './query/get-customer.proxy';
import { RepositoriesModule } from '../repositories/repositories.module';
import { PresentersModule } from '../presenters/presenters.module';
import { LoggerModule } from '@ecore/logger/logger.module';

@Module({
  imports: [
    RepositoriesModule,
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
