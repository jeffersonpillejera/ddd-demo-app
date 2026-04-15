import { Module } from '@nestjs/common';
import { OrderPresenter } from './order.presenter';
import { OrderEventPresenter } from './order-event.presenter';
import { ORDER_PRESENTER } from '../../domain/models/order';
import { EVENT_PRESENTER_TOKEN } from '@ecore/event-publisher/constants';

@Module({
  providers: [
    OrderPresenter,
    { provide: ORDER_PRESENTER, useExisting: OrderPresenter },
    OrderEventPresenter,
    { provide: EVENT_PRESENTER_TOKEN, useExisting: OrderEventPresenter },
  ],
  exports: [
    OrderPresenter,
    OrderEventPresenter,
    ORDER_PRESENTER,
    EVENT_PRESENTER_TOKEN,
  ],
})
export class PresentersModule {}
