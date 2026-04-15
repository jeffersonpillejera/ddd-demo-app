/* eslint-disable @typescript-eslint/unbound-method */
import { CreditPurchaseHandler } from './credit-purchase.handler';
import { CreditPurchaseCommand } from './credit-purchase.command';
import { type ICustomerRepository } from '../../../domain/repositories/customer.repository';
import { type ILogger } from '@ecore/core/logger';
import { Customer } from '../../../domain/models/customer';
import { NotFoundException } from '@ecore/core/common/exceptions';
import { type ICreditPurchaseDTO } from '../../dto.interface';
import {
  Money,
  CurrencyCodeEnum,
} from '@ecore/core/common/value-objects/money';
import { EmailAddress } from '@ecore/core/common/value-objects/email-address';
import { User } from '../../../domain/models/user';
import { Password } from '@ecore/core/common/value-objects/password';
import { IpAddress } from '@ecore/core/common/value-objects/ip-address';

describe('CreditPurchaseHandler', () => {
  let handler: CreditPurchaseHandler;
  let mockCustomerRepository: jest.Mocked<ICustomerRepository>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockCustomer: Customer;

  beforeEach(() => {
    mockCustomerRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
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

    // Create a mock customer
    const mockPassword = Password.validateAndHashPassword('ValidPassword123!');
    const mockIpAddress = IpAddress.create('192.168.1.1');
    const mockUser = User.create({
      password: mockPassword,
      lastIpAddress: mockIpAddress,
      isActive: true,
      dateConfirmed: new Date(),
    });

    mockCustomer = Customer.create(
      {
        user: mockUser,
        firstName: 'John',
        lastName: 'Doe',
        email: EmailAddress.create('test@example.com'),
        creditLimit: Money.create({
          amount: 1000,
          currency: CurrencyCodeEnum.USD,
        }),
      },
      undefined,
    );

    handler = new CreditPurchaseHandler(mockCustomerRepository, mockLogger);
  });

  describe('constructor', () => {
    it('should set logger context', () => {
      expect(mockLogger.setContext).toHaveBeenCalledWith(
        'CreditPurchaseHandler',
      );
    });
  });

  describe('execute', () => {
    const creditPurchaseDTO: ICreditPurchaseDTO = {
      customerId: 'customer-123',
      orderId: 'order-456',
      grandTotal: { amount: 500, currency: CurrencyCodeEnum.USD },
    };

    it('should process credit purchase successfully when customer exists', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(creditPurchaseDTO);
      await handler.execute(command);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${creditPurchaseDTO.customerId} for order ${creditPurchaseDTO.orderId}`,
      );
      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        creditPurchaseDTO.customerId,
      );
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(mockCustomer);
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${creditPurchaseDTO.customerId} for order ${creditPurchaseDTO.orderId} processed`,
      );
    });

    it('should call customer.creditPurchase with correct orderId and amount', async () => {
      const creditPurchaseSpy = jest.spyOn(mockCustomer, 'creditPurchase');
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(creditPurchaseDTO);
      await handler.execute(command);

      expect(creditPurchaseSpy).toHaveBeenCalledWith(
        creditPurchaseDTO.orderId,
        expect.any(Money),
      );
      const moneyArg = creditPurchaseSpy.mock.calls[0][1];
      expect(moneyArg.props.amount).toBe(creditPurchaseDTO.grandTotal.amount);
      expect(moneyArg.props.currency).toBe(
        creditPurchaseDTO.grandTotal.currency,
      );

      creditPurchaseSpy.mockRestore();
    });

    it('should create Money from grandTotal DTO', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(creditPurchaseDTO);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(mockCustomer);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      const command = new CreditPurchaseCommand(creditPurchaseDTO);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        `Customer ${creditPurchaseDTO.customerId} not found`,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${creditPurchaseDTO.customerId} for order ${creditPurchaseDTO.orderId}`,
      );
      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        creditPurchaseDTO.customerId,
      );
      expect(mockCustomerRepository.save).not.toHaveBeenCalled();
      expect(mockLogger.log).not.toHaveBeenCalledWith(
        `Credit purchase for customer ${creditPurchaseDTO.customerId} for order ${creditPurchaseDTO.orderId} processed`,
      );
    });

    it('should handle different order IDs', async () => {
      const dtoWithDifferentOrderId: ICreditPurchaseDTO = {
        ...creditPurchaseDTO,
        orderId: 'order-789',
      };
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(dtoWithDifferentOrderId);
      await handler.execute(command);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${dtoWithDifferentOrderId.customerId} for order ${dtoWithDifferentOrderId.orderId}`,
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${dtoWithDifferentOrderId.customerId} for order ${dtoWithDifferentOrderId.orderId} processed`,
      );
    });

    it('should handle different customer IDs', async () => {
      const dtoWithDifferentCustomerId: ICreditPurchaseDTO = {
        ...creditPurchaseDTO,
        customerId: 'customer-999',
      };
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(dtoWithDifferentCustomerId);
      await handler.execute(command);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Credit purchase for customer ${dtoWithDifferentCustomerId.customerId} for order ${dtoWithDifferentCustomerId.orderId}`,
      );
      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        dtoWithDifferentCustomerId.customerId,
      );
    });

    it('should handle zero amount purchase', async () => {
      const dtoWithZeroAmount: ICreditPurchaseDTO = {
        ...creditPurchaseDTO,
        grandTotal: { amount: 0, currency: CurrencyCodeEnum.USD },
      };
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(dtoWithZeroAmount);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(mockCustomer);
    });

    it('should handle large amount purchase', async () => {
      const dtoWithLargeAmount: ICreditPurchaseDTO = {
        ...creditPurchaseDTO,
        grandTotal: { amount: 999999.99, currency: CurrencyCodeEnum.USD },
      };
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const command = new CreditPurchaseCommand(dtoWithLargeAmount);
      await handler.execute(command);

      expect(mockCustomerRepository.save).toHaveBeenCalledWith(mockCustomer);
    });
  });
});
