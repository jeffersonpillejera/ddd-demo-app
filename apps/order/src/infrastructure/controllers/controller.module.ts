import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ApplicationProxyModule } from '../application-proxy/application-proxy.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [ApplicationProxyModule, CqrsModule],
  controllers: [OrderController],
})
export class ControllersModule {}
