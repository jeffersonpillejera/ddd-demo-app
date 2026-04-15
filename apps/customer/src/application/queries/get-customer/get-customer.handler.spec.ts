/* eslint-disable @typescript-eslint/unbound-method */
import { GetCustomerHandler } from './get-customer.handler';
import { GetCustomerQuery } from './get-customer.query';
import { type ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { type ILogger } from '@ecore/core/logger';
import { type Presenter } from '@ecore/core/presenter';
import { Customer } from '../../../domain/models/customer';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { type ICustomerDTO } from '../../dto.interface';
import { CurrencyCodeEnum } from '@ecore/core/common/value-objects';

describe('GetCustomerHandler', () => {
  let handler: GetCustomerHandler;
  let mockCustomerRepository: jest.Mocked<ICustomerRepository>;
  let mockCustomerPresenter: jest.Mocked<Presenter<Customer, ICustomerDTO>>;
  let mockLogger: jest.Mocked<ILogger>;

  const mockCustomerDTO: ICustomerDTO = {
    customerId: 'customer-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '1234567890',
    creditLimit: { amount: 1000, currency: CurrencyCodeEnum.PHP },
    addresses: [],
  };

  beforeEach(() => {
    mockCustomerRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    mockCustomerPresenter = { toDTO: jest.fn() } as jest.Mocked<
      Presenter<Customer, ICustomerDTO>
    >;

    mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<ILogger>;

    handler = new GetCustomerHandler(
      mockCustomerRepository,
      mockCustomerPresenter,
      mockLogger,
    );
  });

  describe('constructor', () => {
    it('should set logger context', () => {
      expect(mockLogger.setContext).toHaveBeenCalledWith('GetCustomerHandler');
    });
  });

  describe('execute', () => {
    const customerId = 'customer-123';

    it('should return customer DTO when customer exists', async () => {
      const mockCustomer = {} as Customer;
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerPresenter.toDTO.mockReturnValue(mockCustomerDTO);

      const query = new GetCustomerQuery(customerId);
      const result = await handler.execute(query);

      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
      expect(mockCustomerPresenter.toDTO).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomerDTO);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      const query = new GetCustomerQuery(customerId);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        `Customer with id ${customerId} not found`,
      );

      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
      expect(mockCustomerPresenter.toDTO).not.toHaveBeenCalled();
    });

    it('should pass the query id to the repository', async () => {
      const differentId = 'customer-999';
      const mockCustomer = {} as Customer;
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerPresenter.toDTO.mockReturnValue(mockCustomerDTO);

      const query = new GetCustomerQuery(differentId);
      await handler.execute(query);

      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(differentId);
    });

    it('should return the presenter output directly', async () => {
      const anotherDTO: ICustomerDTO = {
        ...mockCustomerDTO,
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const mockCustomer = {} as Customer;
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerPresenter.toDTO.mockReturnValue(anotherDTO);

      const query = new GetCustomerQuery(customerId);
      const result = await handler.execute(query);

      expect(result).toEqual(anotherDTO);
    });
  });
});
