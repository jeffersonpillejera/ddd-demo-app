import {
  CurrencyCodeEnum,
  Money,
} from '@ecore/domain/common/value-objects/money';
import { Customer } from '../../domain/models/customer';
import { DataMapper } from '@ecore/domain/core/data-mapper';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import {
  Address,
  AddressTypeEnum,
  CountryCodeEnum,
} from '@ecore/domain/common/value-objects/address';
import { Prisma } from '../persistence/prisma/generated/client';
import { Password } from '@ecore/domain/common/value-objects/password';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { User } from '../../domain/models/user';
import { IpAddress } from '@ecore/domain/common/value-objects/ip-address';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

type PesistedCustomerEntity = Prisma.CustomerGetPayload<{
  include: { addresses: true; user: true };
}>;
type PersistCustomerDTO = Omit<
  Omit<Prisma.CustomerCreateInput, 'user'> & {
    user: Prisma.UserCreateWithoutCustomerInput;
  },
  'addresses'
> & { addresses: Prisma.AddressCreateWithoutCustomerInput[] };

@Injectable()
export class CustomerDataMapper extends DataMapper<
  Customer,
  PersistCustomerDTO | PesistedCustomerEntity
> {
  toDomain(data: PesistedCustomerEntity): Customer {
    return Customer.create(
      {
        user: User.create(
          {
            requiredLogin: data.user.requiredLogin,
            failedLoginAttempts: data.user.failedLoginAttempts,
            isActive: data.user.isActive,
            dateConfirmed: data.user.dateConfirmed,
            lastLoginDate: data.user.lastLoginDate,
            lastActivityDate: data.user.lastActivityDate,
            password: Password.create({
              hashedPassword: data.user.hashedPassword,
              salt: data.user.salt,
              iterations: data.user.iterations,
            }),
            lastIpAddress: IpAddress.create(data.user.lastIpAddress),
            lastPasswordChangeDate: data.user.lastPasswordChangeDate,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
          new UniqueIdentifier(data.user.id),
        ),
        email: EmailAddress.create(data.email),
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        creditLimit: Money.create({
          amount: data.creditLimit.toNumber(),
          currency: data.creditLimitCurrency as CurrencyCodeEnum,
        }),
        addresses: data.addresses.map((address) =>
          Address.create({
            country: address.country as CountryCodeEnum,
            type: address.type as AddressTypeEnum,
            label: address.label,
            street1: address.street1,
            street2: address.street2 ?? undefined,
            city: address.city,
            province: address.province,
            zip: address.zip,
          }),
        ),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueIdentifier(data.id),
    );
  }

  toPersistence(domain: Customer): PersistCustomerDTO {
    return {
      id: domain.id.toString(),
      email: domain.email.value,
      firstName: domain.firstName,
      lastName: domain.lastName,
      mobileNumber: domain.mobileNumber?.toString() ?? null,
      creditLimit: new Decimal(domain.creditLimit.props.amount),
      creditLimitCurrency: domain.creditLimit.props.currency,
      addresses:
        domain.addresses?.map((address) => ({
          country: address.props.country,
          type: address.props.type,
          label: address.props.label,
          street1: address.props.street1,
          street2: address.props.street2 ?? null,
          city: address.props.city,
          province: address.props.province,
          zip: address.props.zip,
        })) ?? [],
      user: {
        id: domain.user.id.toString(),
        hashedPassword: domain.user.password.props.hashedPassword,
        salt: domain.user.password.props.salt,
        iterations: domain.user.password.props.iterations,
        requiredLogin: domain.user.requiredLogin!,
        failedLoginAttempts: domain.user.failedLoginAttempts!,
        isActive: domain.user.isActive!,
        dateConfirmed: domain.user.dateConfirmed ?? null,
        lastLoginDate: domain.user.lastLoginDate ?? null,
        lastActivityDate: domain.user.lastActivityDate ?? null,
        lastPasswordChangeDate: domain.user.lastPasswordChangeDate ?? null,
        lastIpAddress: domain.user.lastIpAddress!.value,
        createdAt: domain.user.createdAt!,
        updatedAt: domain.user.updatedAt ?? null,
      },
      createdAt: domain.createdAt!,
      updatedAt: domain.updatedAt ?? null,
    };
  }
}
