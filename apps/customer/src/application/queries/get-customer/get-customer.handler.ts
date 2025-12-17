import { ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerDTO } from '../../dtos/customer.dto';
import { IPresenter } from '@ecore/domain/core/presenter';
import { Query } from '@ecore/domain/core/cqrs/query';
import { Customer } from '../../../domain/models/customer';
import { GetCustomerQuery } from './get-customer.query';
import {
  BadRequestException,
  NotFoundException,
} from '@ecore/domain/common/exceptions';

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
    try {
      const customer = await this.customerRepository.findById(request.id);
      if (!customer)
        throw new NotFoundException(`Customer with id ${request.id} not found`);
      return this.customerPresenter.toDTO(customer);
    } catch (error) {
      switch (error instanceof Error ? error.constructor : error) {
        case BadRequestException:
          return this.customerPresenter.badRequest((error as Error).message);
        case NotFoundException:
          return this.customerPresenter.notFound((error as Error).message);
        default:
          return this.customerPresenter.unprocessable((error as Error).message);
      }
    }
  }
}
