import { Module } from '@nestjs/common';
import { CustomerDataMapper } from './customer.data-mapper';

@Module({
  imports: [],
  providers: [CustomerDataMapper],
  exports: [CustomerDataMapper],
})
export class DataMappersModule {}
