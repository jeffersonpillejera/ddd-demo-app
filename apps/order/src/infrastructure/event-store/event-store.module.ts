import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEntity, EventEntitySchema } from './event.schema';
import { EventStore } from './event-store';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
    ]),
  ],
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule {}
