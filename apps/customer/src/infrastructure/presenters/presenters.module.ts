import { Module } from '@nestjs/common';
import { CustomerPresenter } from './customer.presenter';
import { CustomerEventPresenter } from './customer-events.presenter';
import { CUSTOMER_PRESENTER } from '../../domain/models/customer';
import { EVENT_PRESENTER_TOKEN } from '@ecore/event-publisher/constants';

@Module({
  providers: [
    CustomerPresenter,
    { provide: CUSTOMER_PRESENTER, useExisting: CustomerPresenter },
    CustomerEventPresenter,
    { provide: EVENT_PRESENTER_TOKEN, useExisting: CustomerEventPresenter },
  ],
  exports: [
    CustomerPresenter,
    CustomerEventPresenter,
    CUSTOMER_PRESENTER,
    EVENT_PRESENTER_TOKEN,
  ],
})
export class PresentersModule {}
