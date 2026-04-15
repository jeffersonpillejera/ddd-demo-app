import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DomainEvent } from '@ecore/core/domain-event';
import type {
  IOrderConfirmedEventDTO,
  IOrderCanceledEventDTO,
  IOrderPlacedEventDTO,
} from '../../application/dto.interface';

export type EventDocument = HydratedDocument<EventEntity>;

@Schema({ collection: 'events' })
export class EventEntity implements DomainEvent {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  streamName!: string;

  @Prop({ required: true })
  type!: string;

  @Prop({ required: true, type: Object })
  data!:
    | IOrderPlacedEventDTO
    | IOrderConfirmedEventDTO
    | IOrderCanceledEventDTO;

  @Prop({ required: true })
  occurredAt!: Date;

  @Prop({ required: true })
  version!: number;

  @Prop()
  correlationId?: string;

  @Prop()
  causationId?: string;
}

export const EventEntitySchema = SchemaFactory.createForClass(EventEntity);
