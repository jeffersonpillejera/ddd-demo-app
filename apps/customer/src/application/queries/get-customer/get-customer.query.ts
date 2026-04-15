import { Query } from '@nestjs/cqrs';
import { ICustomerDTO } from '../../dto.interface';

export class GetCustomerQuery extends Query<ICustomerDTO> {
  constructor(public readonly id: string) {
    super();
  }
}
