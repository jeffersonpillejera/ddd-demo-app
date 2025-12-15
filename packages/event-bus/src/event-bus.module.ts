import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
