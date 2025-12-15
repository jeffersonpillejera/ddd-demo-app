import { Module } from '@nestjs/common';
import { CustomerPresenter } from './customer.presenter';

@Module({ providers: [CustomerPresenter], exports: [CustomerPresenter] })
export class PresentersModule {}
