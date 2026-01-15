import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ApplicationProxyModule } from '../application-proxy/application-proxy.module';

@Module({ imports: [ApplicationProxyModule], controllers: [OrderController] })
export class ControllersModule {}
