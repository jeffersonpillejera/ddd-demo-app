import { EventStore as IEventStore } from '@ecore/domain/core/event-sourcing/event-store';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity } from './event.schema';
import { ConflictException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventStore implements IEventStore<EventEntity> {
  constructor(
    @InjectModel(EventEntity.name) private eventEntityModel: Model<EventEntity>,
  ) {}

  async save(
    streamName: string,
    events: EventEntity[],
    expectedVersion: number,
  ): Promise<void> {
    // check for concurrency conflicts
    const currentVersion = await this.getStreamVersion(streamName);
    if (currentVersion !== expectedVersion) {
      throw new ConflictException('Concurrency conflict');
    }

    const eventEntities: EventEntity[] = [];
    events.forEach((event) => {
      const { id, occurredAt, type, correlationId, causationId, data } = event;
      expectedVersion++;
      const eventEntity = new EventEntity();
      eventEntity.streamName = streamName;
      eventEntity.data = data;
      eventEntity.id = id;
      eventEntity.occurredAt = occurredAt;
      eventEntity.type = type;
      eventEntity.correlationId = correlationId;
      eventEntity.causationId = causationId;
      eventEntity.version = expectedVersion;
      eventEntities.push(eventEntity);
    });
    await this.eventEntityModel.insertMany(eventEntities);
  }

  async get(streamName: string, fromVersion?: number): Promise<EventEntity[]> {
    const events = await this.eventEntityModel
      .find({
        streamName,
        version:
          fromVersion !== undefined ? { $gte: fromVersion } : { $gte: 0 },
      })
      .sort({ version: 1 }) // Sort by version in ascending order
      .lean();
    return events;
  }

  private async getStreamVersion(streamName: string): Promise<number> {
    const event = await this.eventEntityModel
      .findOne({ streamName })
      .sort({ version: -1 })
      .lean();
    return event?.version ?? -1;
  }
}
