import { ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerDTO } from '../../dtos/customer.dto';
import { IPresenter } from '@ecore/domain/core/presenter';
import { Query } from '@ecore/domain/core/cqrs/query';
import { Customer } from '../../../domain/models/customer';
import { GetCustomerQuery } from './get-customer.query';
import { NotFoundException } from '@ecore/domain/common/exceptions';
import { ILogger } from '@ecore/domain/core/logger';

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
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(request: GetCustomerQuery): Promise<CustomerDTO | void> {
    const customer = await this.customerRepository.findById(request.id);
    if (!customer)
      throw new NotFoundException(`Customer with id ${request.id} not found`);
    return this.customerPresenter.toDTO(customer);
  }
}
