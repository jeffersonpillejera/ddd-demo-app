import { Module } from '@nestjs/common';
import { PlaceOrderProxy } from './commands/place-order.proxy';
import { ConfirmOrderProxy } from './commands/confirm-order.proxy';
import { CancelOrderProxy } from './commands/cancel-order.proxy';
import { GetOrderProxy } from './queries/get-order.proxy';
import { LoggerModule } from '@ecore/logger/logger.module';
import { RepositoriesModule } from '../repositories/repository.module';
import { PresentersModule } from '../presenters/presenters.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    RepositoriesModule,
    PresentersModule,
    UtilsModule,
    LoggerModule.register({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  ],
  providers: [
    PlaceOrderProxy,
    ConfirmOrderProxy,
    CancelOrderProxy,
    GetOrderProxy,
  ],
  exports: [
    PlaceOrderProxy,
    ConfirmOrderProxy,
    CancelOrderProxy,
    GetOrderProxy,
  ],
})
export class ApplicationProxyModule {}
