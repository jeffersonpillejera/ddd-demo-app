// import { CustomerRepository } from '../../domain/repositories/customer.repository';
// import { CustomerDTO } from '../dtos/customer.dto';
// import { Presenter } from '@ecore/domain/core/presenter';
// import { Query } from '@ecore/domain/core/cqrs/query';
// import { Customer } from '../../domain/models/customer';
// import { NotFoundException } from '@ecore/domain/common/exceptions';
// import { ILogger } from '@ecore/domain/core/logger';

// export class GetCustomerQuery implements Query<
//   { id: string },
//   Promise<CustomerDTO | void>
// > {
//   constructor(
//     private readonly customerRepository: CustomerRepository,
//     private readonly customerPresenter: Presenter<Customer, CustomerDTO | void>,
//     private readonly logger: ILogger,
//   ) {
//     this.logger.setContext(this.constructor.name);
//   }

//   async execute(request: { id: string }): Promise<CustomerDTO | void> {
//     const customer = await this.customerRepository.findById(request.id);
//     if (!customer)
//       throw new NotFoundException(`Customer with id ${request.id} not found`);
//     return this.customerPresenter.toDTO(customer);
//   }
// }
