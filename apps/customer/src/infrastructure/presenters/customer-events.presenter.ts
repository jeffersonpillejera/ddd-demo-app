import { DomainEvent } from '@ecore/core/domain-event';
import { Presenter } from '@ecore/core/presenter';
import type {
  ICustomerCreatedEventDTO,
  ICreditPurchaseApprovedEventDTO,
  ICreditPurchaseRejectedEventDTO,
} from '../../application/dto.interface';
import { CreditPurchaseApprovedEvent } from '../../domain/events/credit-purchase-approved.event';
import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { CreditPurchaseRejectedEvent } from '../../domain/events/credit-purchase-rejected.event';
import { Injectable } from '@nestjs/common';
import {
  CreditPurchaseApprovedEventDTO,
  CreditPurchaseRejectedEventDTO,
} from './customer-events.dto';
import { CustomerCreatedEventDTO } from './customer-events.dto';

type CustomerEventDTO =
  | ICustomerCreatedEventDTO
  | ICreditPurchaseApprovedEventDTO
  | ICreditPurchaseRejectedEventDTO;

@Injectable()
export class CustomerEventPresenter implements Presenter<
  DomainEvent,
  CustomerEventDTO
> {
  toDTO(event: DomainEvent): CustomerEventDTO {
    if (event instanceof CustomerCreatedEvent) {
      return new CustomerCreatedEventDTO(event);
    } else if (event instanceof CreditPurchaseApprovedEvent) {
      return new CreditPurchaseApprovedEventDTO(event);
    } else if (event instanceof CreditPurchaseRejectedEvent) {
      return new CreditPurchaseRejectedEventDTO(event);
    } else {
      throw new Error('Unsupported event type');
    }
  }
}
