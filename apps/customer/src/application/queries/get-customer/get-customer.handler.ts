import { ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerDTO } from '../../dtos/customer.dto';
import { IPresenter } from '@ecore/domain/core/presenter';
import { Query } from '@ecore/domain/core/cqrs/query';
import { Customer } from '../../../domain/models/customer';
import { GetCustomerQuery } from './get-customer.query';

export class GetCustomerHandler implements Query<
  GetCustomerQuery,
  Promise<CustomerDTO | void>
> {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly customerPresenter: IPresenter<
      Customer,
      CustomerDTO | void
    >,
  ) {}

  async execute(request: GetCustomerQuery): Promise<CustomerDTO | void> {
    const customer = await this.customerRepository.findById(request.id);
    if (!customer) return this.customerPresenter.notFound(request.id);
    return this.customerPresenter.toDTO(customer);
  }
}
