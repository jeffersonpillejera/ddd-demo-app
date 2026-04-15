import { Module } from '@nestjs/common';
import { EnvConfigModule } from './infrastructure/config/env.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from './infrastructure/config/env.service';
import { CqrsModule } from '@nestjs/cqrs';
import { EventPublisherModule } from '@ecore/event-publisher/event-publisher.module';
import { PresentersModule } from './infrastructure/presenters/presenters.module';
import { PlaceOrderHandler } from './application/commands/place-order/place-order.handler';
import { ConfirmOrderHandler } from './application/commands/confirm-order/confirm-order.handler';
import { CancelOrderHandler } from './application/commands/cancel-order/cancel-order.handler';
import { GetOrderHandler } from './application/queries/get-order/get-order.handler';
import { AllOrderEventsHandler } from './infrastructure/subscribers/all-order-events.handler';
import { ProjectionStoreModule } from './infrastructure/projection-store/projection-store.module';
import { UtilsModule } from './infrastructure/utils/utils.module';
import { LoggerModule } from '@ecore/logger/logger.module';
import { EventStoreModule } from './infrastructure/event-store/event-store.module';
import { SnapshotStoreModule } from './infrastructure/snapshot-store/snapshot-store.module';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { OrderController } from './infrastructure/controllers/order.controller';
import { DataMapperModule } from './infrastructure/data-mappers/data-mapper.module';

@Module({
  imports: [
    EnvConfigModule,
    CqrsModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [EnvConfigModule],
      useFactory: (envConfigService: EnvConfigService) => ({
        uri: envConfigService.database.eventStoreUrl,
      }),
      inject: [EnvConfigService],
    }),
    EventStoreModule,
    SnapshotStoreModule,
    PresentersModule,
    EventPublisherModule.register({ presenterModule: PresentersModule }),
    UtilsModule,
    ProjectionStoreModule,
    DataMapperModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  ],
  controllers: [OrderController],
  providers: [
    PlaceOrderHandler,
    ConfirmOrderHandler,
    CancelOrderHandler,
    GetOrderHandler,
    OrderRepository,
    { provide: ORDER_REPOSITORY, useExisting: OrderRepository },
    AllOrderEventsHandler,
  ],
})
export class OrderModule {}
