import { Customer, CustomerProps } from './customer';
import { User } from './user';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { EmailAddress } from '@ecore/domain/common/value-objects/email-address';
import {
  Money,
  CurrencyCodeEnum,
} from '@ecore/domain/common/value-objects/money';
import {
  Address,
  AddressTypeEnum,
  CountryCodeEnum,
} from '@ecore/domain/common/value-objects/address';
import { Password } from '@ecore/domain/common/value-objects/password';
import { IpAddress } from '@ecore/domain/common/value-objects/ip-address';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/domain/common/exceptions';
import { CustomerCreatedEvent } from '../events/customer-created.event';
import { CreditPurchaseApprovedEvent } from '../events/credit-purchase-approved.event';
import { CreditPurchaseRejectedEvent } from '../events/credit-purchase-rejected.event';

describe('Customer', () => {
  let mockUser: User;
  let mockEmail: EmailAddress;
  let mockCreditLimit: Money;
  let mockAddress: Address;
  let validProps: CustomerProps;

  beforeEach(() => {
    const mockPassword = Password.create({
      hashedPassword: 'hashedPassword123',
      salt: 'salt123',
      iterations: 10000,
    });
    const mockIpAddress = IpAddress.create('192.168.1.1');

    mockUser = User.create({
      password: mockPassword,
      lastIpAddress: mockIpAddress,
      isActive: true,
      dateConfirmed: new Date(),
    });

    mockEmail = EmailAddress.create('test@example.com');
    mockCreditLimit = Money.create({
      amount: 1000,
      currency: CurrencyCodeEnum.USD,
    });
    mockAddress = Address.create({
      label: 'Home',
      street1: '123 Main St',
      city: 'New York',
      province: 'NY',
      zip: '10001',
      country: CountryCodeEnum.US,
      type: AddressTypeEnum.BILLING,
    });

    validProps = {
      user: mockUser,
      firstName: 'John',
      lastName: 'Doe',
      email: mockEmail,
      creditLimit: mockCreditLimit,
      mobileNumber: '1234567890',
      addresses: [mockAddress],
    };
  });

  describe('create', () => {
    it('should create a customer with all required properties', () => {
      const customer = Customer.create(validProps);

      expect(customer).toBeInstanceOf(Customer);
      expect(customer.user).toBe(mockUser);
      expect(customer.firstName).toBe('John');
      expect(customer.lastName).toBe('Doe');
      expect(customer.email).toBe(mockEmail);
      expect(customer.creditLimit).toBe(mockCreditLimit);
      expect(customer.mobileNumber).toBe('1234567890');
      expect(customer.addresses).toEqual([mockAddress]);
      expect(customer.createdAt).toBeInstanceOf(Date);
      expect(customer.updatedAt).toBeUndefined();
    });

    it('should create a customer with optional properties as undefined', () => {
      const propsWithoutOptionals: CustomerProps = {
        user: mockUser,
        firstName: 'John',
        lastName: 'Doe',
        email: mockEmail,
        creditLimit: mockCreditLimit,
      };

      const customer = Customer.create(propsWithoutOptionals);

      expect(customer.mobileNumber).toBeUndefined();
      expect(customer.addresses).toEqual([]);
      expect(customer.createdAt).toBeInstanceOf(Date);
      expect(customer.updatedAt).toBeUndefined();
    });

    it('should create a customer with provided id', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);

      expect(customer.id).toBe(id);
    });

    it('should create a customer with provided createdAt', () => {
      const createdAt = new Date('2023-01-01');
      const propsWithCreatedAt: CustomerProps = { ...validProps, createdAt };

      const customer = Customer.create(propsWithCreatedAt);

      expect(customer.createdAt).toBe(createdAt);
    });

    it('should create a customer with provided updatedAt', () => {
      const updatedAt = new Date('2023-01-02');
      const propsWithUpdatedAt: CustomerProps = { ...validProps, updatedAt };

      const customer = Customer.create(propsWithUpdatedAt);

      expect(customer.updatedAt).toBe(updatedAt);
    });

    it('should emit CustomerCreatedEvent when creating without id and without createdAt', () => {
      const customer = Customer.create(validProps);

      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CustomerCreatedEvent);
      expect((events[0] as CustomerCreatedEvent).customerId).toBe(customer.id);
      expect((events[0] as CustomerCreatedEvent).email).toBe(mockEmail);
      expect((events[0] as CustomerCreatedEvent).firstName).toBe('John');
      expect((events[0] as CustomerCreatedEvent).lastName).toBe('Doe');
      expect((events[0] as CustomerCreatedEvent).creditLimit).toBe(
        mockCreditLimit,
      );
      expect((events[0] as CustomerCreatedEvent).addresses).toEqual([
        mockAddress,
      ]);
      expect((events[0] as CustomerCreatedEvent).mobileNumber).toBe(
        '1234567890',
      );
    });

    it('should emit CustomerCreatedEvent with empty addresses array when addresses is null', () => {
      const propsWithoutAddresses: CustomerProps = {
        ...validProps,
        addresses: null as unknown as Address[],
      };
      const customer = Customer.create(propsWithoutAddresses);

      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CustomerCreatedEvent);
      expect((events[0] as CustomerCreatedEvent).addresses).toEqual([]);
    });

    it('should emit CustomerCreatedEvent with new Date when createdAt is null', () => {
      const propsWithNullCreatedAt: CustomerProps = {
        ...validProps,
        createdAt: null,
      };
      const beforeCreation = new Date();
      const customer = Customer.create(propsWithNullCreatedAt);
      const afterCreation = new Date();

      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CustomerCreatedEvent);
      const eventCreatedAt = (events[0] as CustomerCreatedEvent).createdAt;
      expect(eventCreatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(eventCreatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should not emit CustomerCreatedEvent when creating with id', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);

      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should not emit CustomerCreatedEvent when creating with createdAt', () => {
      const propsWithCreatedAt: CustomerProps = {
        ...validProps,
        createdAt: new Date('2023-01-01'),
      };

      const customer = Customer.create(propsWithCreatedAt);

      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should throw UnprocessableException when user is missing', () => {
      const propsWithoutUser = { ...validProps, user: null as unknown as User };

      expect(() => Customer.create(propsWithoutUser)).toThrow(
        UnprocessableException,
      );
      expect(() => Customer.create(propsWithoutUser)).toThrow(
        'User is required',
      );
    });

    it('should throw BadRequestException when firstName is missing', () => {
      const propsWithoutFirstName: CustomerProps = {
        ...validProps,
        firstName: '',
      };

      expect(() => Customer.create(propsWithoutFirstName)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithoutFirstName);
      }).toThrow('First name is required');
    });

    it('should throw BadRequestException when firstName is only whitespace', () => {
      const propsWithWhitespaceFirstName: CustomerProps = {
        ...validProps,
        firstName: '   ',
      };

      expect(() => Customer.create(propsWithWhitespaceFirstName)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithWhitespaceFirstName);
      }).toThrow('First name is required');
    });

    it('should throw BadRequestException when lastName is missing', () => {
      const propsWithoutLastName: CustomerProps = {
        ...validProps,
        lastName: '',
      };

      expect(() => Customer.create(propsWithoutLastName)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithoutLastName);
      }).toThrow('Last name is required');
    });

    it('should throw BadRequestException when lastName is only whitespace', () => {
      const propsWithWhitespaceLastName: CustomerProps = {
        ...validProps,
        lastName: '   ',
      };

      expect(() => Customer.create(propsWithWhitespaceLastName)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithWhitespaceLastName);
      }).toThrow('Last name is required');
    });

    it('should throw BadRequestException when email is missing', () => {
      const propsWithoutEmail = {
        ...validProps,
        email: null as unknown as EmailAddress,
      };

      expect(() => Customer.create(propsWithoutEmail)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithoutEmail);
      }).toThrow('Email is required');
    });

    it('should throw BadRequestException when creditLimit is missing', () => {
      const propsWithoutCreditLimit = {
        ...validProps,
        creditLimit: null as unknown as Money,
      };

      expect(() => Customer.create(propsWithoutCreditLimit)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Customer.create(propsWithoutCreditLimit);
      }).toThrow('Credit limit is required');
    });
  });

  describe('getters', () => {
    it('should return user', () => {
      const customer = Customer.create(validProps);
      expect(customer.user).toBe(mockUser);
    });

    it('should return firstName', () => {
      const customer = Customer.create(validProps);
      expect(customer.firstName).toBe('John');
    });

    it('should return lastName', () => {
      const customer = Customer.create(validProps);
      expect(customer.lastName).toBe('Doe');
    });

    it('should return email', () => {
      const customer = Customer.create(validProps);
      expect(customer.email).toBe(mockEmail);
    });

    it('should return mobileNumber', () => {
      const customer = Customer.create(validProps);
      expect(customer.mobileNumber).toBe('1234567890');
    });

    it('should return mobileNumber as null when not provided', () => {
      const propsWithoutMobile: CustomerProps = {
        ...validProps,
        mobileNumber: null,
      };
      const customer = Customer.create(propsWithoutMobile);
      expect(customer.mobileNumber).toBeNull();
    });

    it('should return mobileNumber as undefined when not provided', () => {
      const propsWithoutMobile: CustomerProps = {
        ...validProps,
        mobileNumber: undefined,
      };
      const customer = Customer.create(propsWithoutMobile);
      expect(customer.mobileNumber).toBeUndefined();
    });

    it('should return creditLimit', () => {
      const customer = Customer.create(validProps);
      expect(customer.creditLimit).toBe(mockCreditLimit);
    });

    it('should return addresses', () => {
      const customer = Customer.create(validProps);
      expect(customer.addresses).toEqual([mockAddress]);
    });

    it('should return addresses as undefined when not provided', () => {
      const propsWithoutAddresses: CustomerProps = {
        ...validProps,
        addresses: undefined,
      };
      const customer = Customer.create(propsWithoutAddresses);
      expect(customer.addresses).toEqual([]);
    });

    it('should return createdAt', () => {
      const customer = Customer.create(validProps);
      expect(customer.createdAt).toBeInstanceOf(Date);
    });

    it('should return createdAt as null when provided as null', () => {
      const propsWithNullCreatedAt: CustomerProps = {
        ...validProps,
        createdAt: null,
      };
      const customer = Customer.create(propsWithNullCreatedAt);
      expect(customer.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      const updatedAt = new Date('2023-01-02');
      const propsWithUpdatedAt: CustomerProps = { ...validProps, updatedAt };
      const customer = Customer.create(propsWithUpdatedAt);
      expect(customer.updatedAt).toBe(updatedAt);
    });

    it('should return updatedAt as undefined when not provided', () => {
      const customer = Customer.create(validProps);
      expect(customer.updatedAt).toBeUndefined();
    });
  });

  describe('creditPurchase', () => {
    it('should approve credit purchase when creditLimit is greater than amount', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const purchaseAmount = Money.create({
        amount: 500,
        currency: CurrencyCodeEnum.USD,
      });
      const orderId = 'order-123';

      customer.creditPurchase(orderId, purchaseAmount);

      expect(customer.creditLimit.props.amount).toBe(500);
      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CreditPurchaseApprovedEvent);
      expect((events[0] as CreditPurchaseApprovedEvent).customerId).toBe(
        customer.id,
      );
      expect((events[0] as CreditPurchaseApprovedEvent).orderId).toBe(orderId);
    });

    it('should approve credit purchase when creditLimit equals amount', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const purchaseAmount = Money.create({
        amount: 1000,
        currency: CurrencyCodeEnum.USD,
      });
      const orderId = 'order-123';

      customer.creditPurchase(orderId, purchaseAmount);

      expect(customer.creditLimit.props.amount).toBe(0);
      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CreditPurchaseApprovedEvent);
    });

    it('should reject credit purchase when creditLimit is less than amount', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const purchaseAmount = Money.create({
        amount: 1500,
        currency: CurrencyCodeEnum.USD,
      });
      const orderId = 'order-123';
      const originalCreditLimit = customer.creditLimit;

      customer.creditPurchase(orderId, purchaseAmount);

      expect(customer.creditLimit).toBe(originalCreditLimit);
      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CreditPurchaseRejectedEvent);
      expect((events[0] as CreditPurchaseRejectedEvent).customerId).toBe(
        customer.id,
      );
      expect((events[0] as CreditPurchaseRejectedEvent).orderId).toBe(orderId);
    });

    it('should subtract amount from creditLimit when approved', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const purchaseAmount = Money.create({
        amount: 300,
        currency: CurrencyCodeEnum.USD,
      });
      const orderId = 'order-123';

      customer.creditPurchase(orderId, purchaseAmount);

      expect(customer.creditLimit.props.amount).toBe(700);
    });

    it('should handle multiple credit purchases', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const firstPurchase = Money.create({
        amount: 300,
        currency: CurrencyCodeEnum.USD,
      });
      const secondPurchase = Money.create({
        amount: 400,
        currency: CurrencyCodeEnum.USD,
      });

      customer.creditPurchase('order-1', firstPurchase);
      customer.creditPurchase('order-2', secondPurchase);

      expect(customer.creditLimit.props.amount).toBe(300);
      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(CreditPurchaseApprovedEvent);
      expect(events[1]).toBeInstanceOf(CreditPurchaseApprovedEvent);
    });

    it('should reject purchase after credit limit is exhausted', () => {
      const id = new UniqueIdentifier();
      const customer = Customer.create(validProps, id);
      customer.uncommit(); // Clear CustomerCreatedEvent
      const firstPurchase = Money.create({
        amount: 1000,
        currency: CurrencyCodeEnum.USD,
      });
      const secondPurchase = Money.create({
        amount: 100,
        currency: CurrencyCodeEnum.USD,
      });

      customer.creditPurchase('order-1', firstPurchase);
      customer.creditPurchase('order-2', secondPurchase);

      expect(customer.creditLimit.props.amount).toBe(0);
      const events = customer.getUncommittedEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(CreditPurchaseApprovedEvent);
      expect(events[1]).toBeInstanceOf(CreditPurchaseRejectedEvent);
    });
  });
});
