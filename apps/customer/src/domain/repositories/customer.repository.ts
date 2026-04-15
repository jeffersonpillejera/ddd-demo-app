import { Customer } from '../models/customer';
import { Repository, filterOptions } from '@ecore/core/repository';
import { EmailAddress } from '@ecore/core/common/value-objects/email-address';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
export interface CustomerFilter extends filterOptions<Customer> {
  firstName?: string;
  lastName?: string;
}

export interface ICustomerRepository extends Repository<Customer> {
  findByEmail(email: EmailAddress): Promise<Customer | null>;
  findMany(filter?: CustomerFilter): Promise<Customer[]>;
}
