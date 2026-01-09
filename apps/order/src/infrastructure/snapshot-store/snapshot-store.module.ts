import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SnapshotEntity, SnapshotEntitySchema } from './snapshot.schema';
import { OrderSnapshotStore } from './order.snapshot-store';
import { DataMapperModule } from '../data-mappers/data-mapper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SnapshotEntity.name, schema: SnapshotEntitySchema },
    ]),
    DataMapperModule,
  ],
  providers: [OrderSnapshotStore],
  exports: [OrderSnapshotStore],
})
export class SnapshotStoreModule {}
