import { Module } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { DataMapperModule } from '../data-mappers/data-mapper.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { SnapshotStoreModule } from '../snapshot-store/snapshot-store.module';
import { ProjectionStoreModule } from '../projection-store/projection-store.module';

@Module({
  imports: [
    DataMapperModule,
    EventStoreModule,
    SnapshotStoreModule,
    ProjectionStoreModule,
  ],
  providers: [OrderRepository],
  exports: [OrderRepository],
})
export class RepositoriesModule {}
