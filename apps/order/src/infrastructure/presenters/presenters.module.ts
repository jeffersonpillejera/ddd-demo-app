import { Module } from '@nestjs/common';
import { OrderPresenter } from './order.presenter';

@Module({ providers: [OrderPresenter], exports: [OrderPresenter] })
export class PresentersModule {}
