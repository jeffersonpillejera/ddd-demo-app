import { Module } from '@nestjs/common';
import { OrderPlacedHandler } from './order-placed.handler';
import { LoggerModule } from '@ecore/logger/logger.module';
import { OrderConfirmedHandler } from './order-confirmed.handler';
import { OrderCancelledHandler } from './order-cancelled.handler';
import { ProjectionStoreModule } from '../projection-store/projection-store.module';

@Module({
  imports: [
    ProjectionStoreModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  ],
  providers: [OrderPlacedHandler, OrderConfirmedHandler, OrderCancelledHandler],
})
export class SubscribersModule {}
