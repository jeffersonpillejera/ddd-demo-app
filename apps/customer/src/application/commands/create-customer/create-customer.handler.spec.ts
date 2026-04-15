/* eslint-disable @typescript-eslint/unbound-method */
import { CreateCustomerHandler } from './create-customer.handler';
import { CreateCustomerCommand } from './create-customer.command';
import { type ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { type ILogger } from '@ecore/core/logger';
import { Customer } from '../../../domain/models/customer';
import { EmailAddress } from '@ecore/core/common/value-objects/email-address';
import { BadRequestException } from '@ecore/core/common/exceptions';
import {
  type ICreateCustomerDTO,
  type ICustomerAddressDTO,
} from '../../dto.interface';
import {
  AddressTypeEnum,
  CountryCodeEnum,
} from '@ecore/core/common/value-objects/address';
import { CurrencyCodeEnum } from '@ecore/core/common/value-objects/money';

describe('CreateCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let mockCustomerRepository: jest.Mocked<ICustomerRepository>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockCustomerRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<ILogger>;

    handler = new CreateCustomerHandler(mockCustomerRepository, mockLogger);
  });

  describe('constructor', () => {
    it('should set logger context', () => {
      expect(mockLogger.setContext).toHaveBeenCalledWith(
        'CreateCustomerHandler',
      );
    });
  });

  describe('execute', () => {
    const createCustomerDTO: ICreateCustomerDTO = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      addresses: [
        {
          label: 'Home',
          street1: '123 Main St',
          street2: 'Apt 4B',
          city: 'Manila',
          province: 'Metro Manila',
          zip: '1000',
          country: CountryCodeEnum.PH,
          type: AddressTypeEnum.BILLING,
        },
      ],
      password: 'ValidPassword123!',
      lastIpAddress: '192.168.1.1',
    };

    it('should create a customer successfully when email does not exist', async () => {
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(createCustomerDTO);
      await handler.execute(command);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Creating customer with email ${createCustomerDTO.email}`,
      );
      expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(EmailAddress),
      );
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Customer with email ${createCustomerDTO.email} created successfully`,
      );
    });

    it('should create a customer without addresses when addresses is not provided', async () => {
      const dtoWithoutAddresses: ICreateCustomerDTO = {
        ...createCustomerDTO,
        addresses: [],
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithoutAddresses);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
    });

    it('should create a customer without mobileNumber when mobileNumber is not provided', async () => {
      const dtoWithoutMobile: ICreateCustomerDTO = {
        ...createCustomerDTO,
        mobileNumber: null,
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithoutMobile);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
    });

    it('should create a customer without mobileNumber when mobileNumber is undefined', async () => {
      const dtoWithoutMobile: ICreateCustomerDTO = {
        ...createCustomerDTO,
        mobileNumber: undefined,
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithoutMobile);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
    });

    it('should create a customer with multiple addresses', async () => {
      const dtoWithMultipleAddresses: ICreateCustomerDTO = {
        ...createCustomerDTO,
        addresses: [
          {
            label: 'Home',
            street1: '123 Main St',
            city: 'Manila',
            province: 'Metro Manila',
            zip: '1000',
            country: CountryCodeEnum.PH,
            type: AddressTypeEnum.BILLING,
          },
          {
            label: 'Work',
            street1: '456 Business Ave',
            city: 'Makati',
            province: 'Metro Manila',
            zip: '1200',
            country: CountryCodeEnum.PH,
            type: AddressTypeEnum.SHIPPING,
          },
        ],
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithMultipleAddresses);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
    });

    it('should create a customer with address without street2', async () => {
      const dtoWithoutStreet2: ICreateCustomerDTO = {
        ...createCustomerDTO,
        addresses: [
          {
            label: 'Home',
            street1: '123 Main St',
            city: 'Manila',
            province: 'Metro Manila',
            zip: '1000',
            country: CountryCodeEnum.PH,
            type: AddressTypeEnum.BILLING,
          },
        ],
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithoutStreet2);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
    });

    it('should throw BadRequestException when customer with email already exists', async () => {
      const existingCustomer = {} as Customer;
      mockCustomerRepository.findByEmail.mockResolvedValue(existingCustomer);

      const command = new CreateCustomerCommand(createCustomerDTO);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        `Customer with email ${createCustomerDTO.email} already exists`,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Creating customer with email ${createCustomerDTO.email}`,
      );
      expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(EmailAddress),
      );
      expect(mockCustomerRepository.save).not.toHaveBeenCalled();
    });

    it('should create customer with default credit limit of 1000 PHP', async () => {
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(createCustomerDTO);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
      const savedCustomer = mockCustomerRepository.save.mock.calls[0][0];
      expect(savedCustomer.creditLimit.props.amount).toBe(1000);
      expect(savedCustomer.creditLimit.props.currency).toBe(
        CurrencyCodeEnum.PHP,
      );
    });

    it('should create EmailAddress from email string', async () => {
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(createCustomerDTO);
      await handler.execute(command);

      expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(EmailAddress),
      );
      const emailArg = mockCustomerRepository.findByEmail.mock.calls[0][0];
      expect(emailArg.value).toBe(createCustomerDTO.email);
    });

    it('should create addresses from DTO array', async () => {
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(createCustomerDTO);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
      const savedCustomer = mockCustomerRepository.save.mock.calls[0][0];
      expect(savedCustomer.addresses).toHaveLength(1);
      expect(savedCustomer.addresses?.[0].props.label).toBe('Home');
      expect(savedCustomer.addresses?.[0].props.street1).toBe('123 Main St');
      expect(savedCustomer.addresses?.[0].props.city).toBe('Manila');
    });

    it('should handle null addresses array', async () => {
      const dtoWithNullAddresses = {
        ...createCustomerDTO,
        addresses: null as unknown as ICustomerAddressDTO[],
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithNullAddresses);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
      const savedCustomer = mockCustomerRepository.save.mock.calls[0][0];
      expect(savedCustomer.addresses).toEqual([]);
    });

    it('should handle undefined addresses', async () => {
      const dtoWithUndefinedAddresses = {
        ...createCustomerDTO,
        addresses: undefined as unknown as ICustomerAddressDTO[],
      };
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue({} as Customer);

      const command = new CreateCustomerCommand(dtoWithUndefinedAddresses);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(
        expect.any(Customer),
      );
      const savedCustomer = mockCustomerRepository.save.mock.calls[0][0];
      expect(savedCustomer.addresses).toEqual([]);
    });
  });
});
