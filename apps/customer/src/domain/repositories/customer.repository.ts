import { Customer } from '../models/customer';
import { Repository } from '@ecore/domain/core/repository';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';

export interface CustomerRepository extends Repository<Customer> {
  findByEmail(email: EmailAddress): Promise<Customer | null>;
}
