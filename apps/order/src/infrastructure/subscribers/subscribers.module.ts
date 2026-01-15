import { Module } from '@nestjs/common';
import { LoggerModule } from '@ecore/logger/logger.module';
import { ProjectionStoreModule } from '../projection-store/projection-store.module';
import { AllOrderEventsHandler } from './all-order-events.handler';

@Module({
  imports: [
    ProjectionStoreModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  ],
  providers: [AllOrderEventsHandler],
})
export class SubscribersModule {}
