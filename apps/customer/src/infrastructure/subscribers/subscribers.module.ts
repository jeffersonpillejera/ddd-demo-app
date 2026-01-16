import { Module } from '@nestjs/common';
import { LoggerModule } from '@ecore/logger/logger.module';
import { AllCustomerEventsHandler } from './all-customer-events.handler';

@Module({
  imports: [
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'CustomerService',
    }),
  ],
  providers: [AllCustomerEventsHandler],
})
export class SubscribersModule {}
