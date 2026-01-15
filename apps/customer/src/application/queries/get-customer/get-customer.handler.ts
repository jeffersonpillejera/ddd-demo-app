import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerDTO } from '../../dtos/customer.dto';
import { Presenter } from '@ecore/domain/core/presenter';
import { QueryHandler } from '@ecore/domain/core/cqrs/query.handler';
import { Customer } from '../../../domain/models/customer';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { ILogger } from '@ecore/domain/core/logger';
import { GetCustomerQuery } from './get-customer.query';

export class GetCustomerHandler implements QueryHandler<
  GetCustomerQuery,
  Promise<CustomerDTO>
> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerPresenter: Presenter<Customer, CustomerDTO>,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetCustomerQuery): Promise<CustomerDTO> {
    const customer = await this.customerRepository.findById(query.id);
    if (!customer)
      throw new NotFoundException(`Customer with id ${query.id} not found`);
    return this.customerPresenter.toDTO(customer);
  }
}
