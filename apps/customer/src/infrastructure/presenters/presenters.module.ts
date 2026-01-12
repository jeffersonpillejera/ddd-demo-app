import { Module } from '@nestjs/common';
import { CustomerPresenter } from './customer.presenter';
import { CustomerEventPresenter } from './customer-event.presenter';

@Module({
  providers: [CustomerPresenter, CustomerEventPresenter],
  exports: [CustomerPresenter, CustomerEventPresenter],
})
export class PresentersModule {}
