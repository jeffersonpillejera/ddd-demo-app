import { DomainEvent } from '@ecore/domain/core/domain-event';
import { Presenter } from '@ecore/domain/core/presenter';
import type {
  CustomerCreatedEventDTO,
  CreditPurchaseApprovedEventDTO,
  CreditPurchaseRejectedEventDTO,
} from '../../application/dtos/customer.dto';
import { CreditPurchaseApprovedEvent } from '../../domain/events/credit-purchase-approved.event';
import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { CreditPurchaseRejectedEvent } from '../../domain/events/credit-purchase-rejected.event';

type CustomerEventDTO =
  | CustomerCreatedEventDTO
  | CreditPurchaseApprovedEventDTO
  | CreditPurchaseRejectedEventDTO;

export class CustomerEventPresenter implements Presenter<
  DomainEvent,
  CustomerEventDTO
> {
  toDTO(domain: DomainEvent): CustomerEventDTO {
    switch (domain.constructor.name) {
      case CustomerCreatedEvent.name: {
        const customerCreatedEvent = domain as unknown as CustomerCreatedEvent;
        return {
          customerId: customerCreatedEvent.customerId.toString(),
          email: customerCreatedEvent.email.value,
          firstName: customerCreatedEvent.firstName,
          lastName: customerCreatedEvent.lastName,
          creditLimit: customerCreatedEvent.creditLimit.props,
          addresses:
            customerCreatedEvent.addresses?.map((address) => ({
              label: address.props.label,
              street1: address.props.street1,
              street2: address.props.street2 ?? undefined,
              city: address.props.city,
              province: address.props.province,
              zip: address.props.zip,
              country: address.props.country,
              type: address.props.type,
            })) ?? [],
          createdAt: customerCreatedEvent.createdAt,
          mobileNumber: customerCreatedEvent.mobileNumber,
        };
      }
      case CreditPurchaseApprovedEvent.name: {
        const creditPurchaseApprovedEvent =
          domain as unknown as CreditPurchaseApprovedEvent;
        return {
          customerId: creditPurchaseApprovedEvent.customerId.toString(),
          orderId: creditPurchaseApprovedEvent.orderId.toString(),
        };
      }
      case CreditPurchaseRejectedEvent.name: {
        const creditPurchaseRejectedEvent =
          domain as unknown as CreditPurchaseRejectedEvent;
        return {
          customerId: creditPurchaseRejectedEvent.customerId.toString(),
          orderId: creditPurchaseRejectedEvent.orderId.toString(),
        };
      }
      default:
        throw new Error(`Unknown event type: ${domain.constructor.name}`);
    }
  }
}
