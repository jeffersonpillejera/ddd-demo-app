import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { ApplicationProxyModule } from '../application-proxy/application-proxy.module';

@Module({
  imports: [ApplicationProxyModule],
  controllers: [CustomerController],
})
export class ControllersModule {}
