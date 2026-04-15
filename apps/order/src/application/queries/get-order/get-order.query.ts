import { Query } from '@nestjs/cqrs';
import { IOrderDTO } from '../../dto.interface';

export class GetOrderQuery extends Query<IOrderDTO> {
  constructor(public readonly orderId: string) {
    super();
  }
}
