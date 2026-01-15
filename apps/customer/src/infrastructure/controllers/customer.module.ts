import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { ApplicationProxyModule } from '../application-proxy/application-proxy.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [ApplicationProxyModule, CqrsModule],
  controllers: [CustomerController],
})
export class ControllersModule {}
