import { Presenter } from '@ecore/core/presenter';
import {
  IOrderPlacedEventDTO,
  IOrderConfirmedEventDTO,
  IOrderCanceledEventDTO,
} from '../../application/dto.interface';
import { DomainEvent } from '@ecore/core/domain-event';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import {
  OrderCancelledEventDTO,
  OrderConfirmedEventDTO,
  OrderPlacedEventDTO,
} from './order-event.dto';
import { Injectable } from '@nestjs/common';

type OrderEventDTO =
  | IOrderPlacedEventDTO
  | IOrderConfirmedEventDTO
  | IOrderCanceledEventDTO;

@Injectable()
export class OrderEventPresenter implements Presenter<
  DomainEvent,
  OrderEventDTO
> {
  toDTO(event: DomainEvent): OrderEventDTO {
    if (event instanceof OrderPlacedEvent) {
      return new OrderPlacedEventDTO(event);
    } else if (event instanceof OrderConfirmedEvent) {
      return new OrderConfirmedEventDTO(event);
    } else if (event instanceof OrderCancelledEvent) {
      return new OrderCancelledEventDTO(event);
    } else {
      throw new Error('Unsupported event type');
    }
  }
}
