import { Module } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { DataMappersModule } from '../data-mappers/data-mappers.module';

@Module({
  imports: [DataMappersModule],
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class RepositoriesModule {}
