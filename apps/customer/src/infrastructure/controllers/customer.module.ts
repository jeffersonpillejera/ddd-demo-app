import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { ApplicationProxyModule } from '../application-proxy.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ApplicationProxyModule.register()],
  controllers: [CustomerController, AuthController],
})
export class ControllersModule {}
