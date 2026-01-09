import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ApplicationProxyModule } from '../application-proxy.module';

@Module({
  imports: [ApplicationProxyModule.register()],
  controllers: [OrderController],
})
export class ControllersModule {}
