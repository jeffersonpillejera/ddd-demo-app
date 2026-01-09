import { Module } from '@nestjs/common';
import { OrderDataMapper } from './order.data-mapper';
import { OrderEventsDataMapper } from './order-events.data-mapper';

@Module({
  providers: [OrderDataMapper, OrderEventsDataMapper],
  exports: [OrderDataMapper, OrderEventsDataMapper],
})
export class DataMapperModule {}
