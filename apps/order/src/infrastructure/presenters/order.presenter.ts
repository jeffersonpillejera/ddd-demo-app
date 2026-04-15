import { Presenter } from '@ecore/core/presenter';
import { Order } from '../../domain/models/order';
import { OrderDTO } from './order.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderPresenter implements Presenter<Order, OrderDTO> {
  toDTO(domain: Order): OrderDTO {
    return new OrderDTO(domain);
  }
}
