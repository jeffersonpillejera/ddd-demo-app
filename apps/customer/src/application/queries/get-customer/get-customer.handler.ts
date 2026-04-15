import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../../domain/repositories/customer.repository';
import { ICustomerDTO } from '../../dto.interface';
import { type Presenter } from '@ecore/core/presenter';
import { Customer, CUSTOMER_PRESENTER } from '../../../domain/models/customer';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { type ILogger } from '@ecore/core/logger';
import { GetCustomerQuery } from './get-customer.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { LOGGER_TOKEN } from '@ecore/logger/constants';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  ICustomerDTO
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(CUSTOMER_PRESENTER)
    private readonly customerPresenter: Presenter<Customer, ICustomerDTO>,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(query: GetCustomerQuery): Promise<ICustomerDTO> {
    const customer = await this.customerRepository.findById(query.id);
    if (!customer)
      throw new NotFoundException(`Customer with id ${query.id} not found`);
    return this.customerPresenter.toDTO(customer);
  }
}
