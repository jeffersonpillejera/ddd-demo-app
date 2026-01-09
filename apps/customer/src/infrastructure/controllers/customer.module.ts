import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { ApplicationProxyModule } from '../application-proxy.module';

@Module({
  imports: [ApplicationProxyModule.register()],
  controllers: [CustomerController],
})
export class ControllersModule {}
