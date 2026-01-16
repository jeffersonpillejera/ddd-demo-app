import { GetCustomerHandler } from '../../../application/queries/get-customer/get-customer.handler';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../../../application/queries/get-customer/get-customer.query';
import { CustomerRepository } from '../../repositories/customer.repository';
import { CustomerDTO } from '../../../application/dtos/customer.dto';
import { LoggerService } from '@ecore/logger/logger.service';
import { CustomerPresenter } from '../../presenters/customer.presenter';

@QueryHandler(GetCustomerQuery)
export class GetCustomerProxy
  extends GetCustomerHandler
  implements IQueryHandler<GetCustomerQuery, CustomerDTO>
{
  constructor(
    customerRepository: CustomerRepository,
    customerPresenter: CustomerPresenter,
    logger: LoggerService,
  ) {
    super(customerRepository, customerPresenter, logger);
  }

  async execute(query: GetCustomerQuery): Promise<CustomerDTO> {
    return super.execute(query);
  }
}
