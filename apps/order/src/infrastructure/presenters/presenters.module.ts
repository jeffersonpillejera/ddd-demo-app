import { Module } from '@nestjs/common';
import { OrderPresenter } from './order.presenter';
import { OrderEventPresenter } from './order-event.presenter';

@Module({
  providers: [OrderPresenter, OrderEventPresenter],
  exports: [OrderPresenter, OrderEventPresenter],
})
export class PresentersModule {}
