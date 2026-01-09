import { Command } from '@ecore/domain/core/cqrs/command';
import { Customer } from '../../domain/models/customer';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { User } from '../../domain/models/user';
import {
  Address,
  CountryCodeEnum,
} from '@ecore/domain/common/value-objects/address';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import {
  CurrencyCodeEnum,
  Money,
} from '@ecore/domain/common/value-objects/money';
import { Password } from '@ecore/domain/common/value-objects/password';
import { DomainEventBus } from '@ecore/domain/core/domain-event-bus';
import { IpAddress } from '@ecore/domain/common/value-objects/ip-address';
import { BadRequestException } from '@ecore/domain/common/exceptions';
import { ILogger } from '@ecore/domain/core/logger';
import { CreateCustomerDTO } from '../dtos/customer.dto';

export class CreateCustomerCommand implements Command<CreateCustomerDTO> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly domainEventBus: DomainEventBus,
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(request: CreateCustomerDTO) {
    this.logger.log(`Creating customer with email ${request.email}`);

    const {
      email,
      firstName,
      lastName,
      mobileNumber,
      addresses,
      password,
      lastIpAddress,
    } = request;
    const emailAddress = EmailAddress.create(email);

    let customer = await this.customerRepository.findByEmail(emailAddress);
    if (customer)
      throw new BadRequestException(
        `Customer with email ${email} already exists`,
      );

    customer = Customer.create({
      email: emailAddress,
      firstName,
      lastName,
      mobileNumber,
      creditLimit: Money.create({
        amount: 1000,
        currency: CurrencyCodeEnum.PHP,
      }),
      addresses:
        addresses?.map((address) =>
          Address.create({
            country: address.country as CountryCodeEnum,
            type: address.type,
            label: address.label,
            street1: address.street1,
            street2: address.street2,
            city: address.city,
            province: address.province,
            zip: address.zip,
          }),
        ) ?? [],
      user: User.create({
        password: Password.validateAndHashPassword(password),
        lastIpAddress: IpAddress.create(lastIpAddress),
      }),
    });

    await this.customerRepository.save(customer);
    this.domainEventBus.publish(customer);
    this.logger.log(`Customer with email ${email} created successfully`);
  }
}
