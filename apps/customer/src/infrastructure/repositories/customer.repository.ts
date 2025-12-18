import { PersistenceService } from '../persistence/persistence.service';
import { CustomerRepository as DomainCustomerRepository } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/models/customer';
import { Injectable } from '@nestjs/common';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import { CustomerDataMapper } from '../data-mappers/customer.data-mapper';

@Injectable()
export class CustomerRepository implements DomainCustomerRepository {
  constructor(
    private readonly persistenceService: PersistenceService,
    private readonly customerDataMapper: CustomerDataMapper,
  ) {}

  async findByEmail(email: EmailAddress): Promise<Customer | null> {
    const customer = await this.persistenceService.customer.findFirst({
      where: { email: email.value },
      include: { user: true, addresses: true },
    });

    if (!customer) return null;
    return this.customerDataMapper.toDomain(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.persistenceService.customer.findUnique({
      where: { id },
      include: { user: true, addresses: true },
    });

    if (!customer) return null;
    return this.customerDataMapper.toDomain(customer);
  }

  async save(domain: Customer): Promise<Customer> {
    const { addresses, user, ...customer } =
      this.customerDataMapper.toPersistence(domain);

    const persistedCustomer = await this.persistenceService.customer.upsert({
      where: { id: domain.id.toString() },
      create: {
        ...customer,
        addresses: { create: addresses },
        user: { create: user },
      },
      update: {
        ...customer,
        addresses: {
          deleteMany: { customerId: customer.id.toString() },
          create: addresses,
        },
        user: { update: user },
      },
      include: { user: true, addresses: true },
    });
    return this.customerDataMapper.toDomain(persistedCustomer);
  }
}
