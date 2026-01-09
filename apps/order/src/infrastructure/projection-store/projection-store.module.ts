import { Module } from '@nestjs/common';
import { ProjectionStoreService } from './projection-store.service';
import { EnvConfigModule } from '../config/env.module';
import { OrderProjectionRebuilder } from './order.projection-rebuilder';
import { DataMapperModule } from '../data-mappers/data-mapper.module';
import { EventStoreModule } from '../event-store/event-store.module';

@Module({
  imports: [EnvConfigModule, DataMapperModule, EventStoreModule],
  providers: [ProjectionStoreService, OrderProjectionRebuilder],
  exports: [ProjectionStoreService, OrderProjectionRebuilder],
})
export class ProjectionStoreModule {}
