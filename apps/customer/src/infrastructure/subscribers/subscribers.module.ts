import { Module } from '@nestjs/common';
import { CustomerCreatedHandler } from './customer-created.handler';
import { LoggerModule } from '@ecore/logger/logger.module';

@Module({
  imports: [
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'CustomerService',
    }),
  ],
  providers: [CustomerCreatedHandler],
})
export class SubscribersModule {}
