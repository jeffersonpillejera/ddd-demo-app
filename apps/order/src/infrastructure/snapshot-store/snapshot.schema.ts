import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnapshotDocument = HydratedDocument<SnapshotEntity>;

@Schema({ collection: 'snapshots' })
export class SnapshotEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  aggregateId: string;

  @Prop({ required: true })
  aggregateType: string;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, type: Object })
  data: Record<string, any>;
}

export const SnapshotEntitySchema =
  SchemaFactory.createForClass(SnapshotEntity);
