import { OrderItem, OrderItemProps } from './order-item';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import {
  Money,
  CurrencyCodeEnum,
} from '@ecore/domain/common/value-objects/money';
import { BadRequestException } from '@ecore/domain/common/exceptions';

describe('OrderItem', () => {
  let mockUnitPrice: Money;
  let validProps: OrderItemProps;

  beforeEach(() => {
    mockUnitPrice = Money.create({
      amount: 100,
      currency: CurrencyCodeEnum.USD,
    });

    validProps = {
      productId: 'product-123',
      quantity: 2,
      unitPrice: mockUnitPrice,
    };
  });

  describe('create', () => {
    it('should create an order item with all required properties', () => {
      const orderItem = OrderItem.create(validProps);

      expect(orderItem).toBeInstanceOf(OrderItem);
      expect(orderItem.productId).toBe('product-123');
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.unitPrice).toBe(mockUnitPrice);
    });

    it('should create an order item with provided id', () => {
      const id = new UniqueIdentifier();
      const orderItem = OrderItem.create(validProps, id);

      expect(orderItem.id).toBe(id);
    });

    it('should throw BadRequestException when productId is missing', () => {
      const propsWithoutProductId: OrderItemProps = {
        ...validProps,
        productId: '',
      };

      expect(() => OrderItem.create(propsWithoutProductId)).toThrow(
        BadRequestException,
      );
      expect(() => {
        OrderItem.create(propsWithoutProductId);
      }).toThrow('Product ID is required');
    });

    it('should throw BadRequestException when quantity is zero', () => {
      const propsWithZeroQuantity: OrderItemProps = {
        ...validProps,
        quantity: 0,
      };

      expect(() => OrderItem.create(propsWithZeroQuantity)).toThrow(
        BadRequestException,
      );
      expect(() => {
        OrderItem.create(propsWithZeroQuantity);
      }).toThrow('Quantity must be greater than 0');
    });

    it('should throw BadRequestException when quantity is negative', () => {
      const propsWithNegativeQuantity: OrderItemProps = {
        ...validProps,
        quantity: -1,
      };

      expect(() => OrderItem.create(propsWithNegativeQuantity)).toThrow(
        BadRequestException,
      );
      expect(() => {
        OrderItem.create(propsWithNegativeQuantity);
      }).toThrow('Quantity must be greater than 0');
    });

    it('should throw BadRequestException when unitPrice is missing', () => {
      const propsWithoutUnitPrice = {
        ...validProps,
        unitPrice: null as unknown as Money,
      };

      expect(() => OrderItem.create(propsWithoutUnitPrice)).toThrow(
        BadRequestException,
      );
      expect(() => {
        OrderItem.create(propsWithoutUnitPrice);
      }).toThrow('Unit price is required');
    });

    it('should create order item with quantity of 1', () => {
      const propsWithQuantityOne: OrderItemProps = {
        ...validProps,
        quantity: 1,
      };

      const orderItem = OrderItem.create(propsWithQuantityOne);

      expect(orderItem.quantity).toBe(1);
    });

    it('should create order item with large quantity', () => {
      const propsWithLargeQuantity: OrderItemProps = {
        ...validProps,
        quantity: 1000,
      };

      const orderItem = OrderItem.create(propsWithLargeQuantity);

      expect(orderItem.quantity).toBe(1000);
    });

    it('should create order item with different currency', () => {
      const phpUnitPrice = Money.create({
        amount: 5000,
        currency: CurrencyCodeEnum.PHP,
      });
      const propsWithPHP: OrderItemProps = {
        ...validProps,
        unitPrice: phpUnitPrice,
      };

      const orderItem = OrderItem.create(propsWithPHP);

      expect(orderItem.unitPrice.props.currency).toBe(CurrencyCodeEnum.PHP);
    });
  });

  describe('getters', () => {
    it('should return productId', () => {
      const orderItem = OrderItem.create(validProps);
      expect(orderItem.productId).toBe('product-123');
    });

    it('should return quantity', () => {
      const orderItem = OrderItem.create(validProps);
      expect(orderItem.quantity).toBe(2);
    });

    it('should return unitPrice', () => {
      const orderItem = OrderItem.create(validProps);
      expect(orderItem.unitPrice).toBe(mockUnitPrice);
    });

    it('should calculate totalPrice correctly', () => {
      const orderItem = OrderItem.create(validProps);

      expect(orderItem.totalPrice.props.amount).toBe(200);
      expect(orderItem.totalPrice.props.currency).toBe(CurrencyCodeEnum.USD);
    });

    it('should calculate totalPrice for quantity of 1', () => {
      const propsWithQuantityOne: OrderItemProps = {
        ...validProps,
        quantity: 1,
      };
      const orderItem = OrderItem.create(propsWithQuantityOne);

      expect(orderItem.totalPrice.props.amount).toBe(100);
    });

    it('should calculate totalPrice for large quantity', () => {
      const propsWithLargeQuantity: OrderItemProps = {
        ...validProps,
        quantity: 10,
      };
      const orderItem = OrderItem.create(propsWithLargeQuantity);

      expect(orderItem.totalPrice.props.amount).toBe(1000);
    });

    it('should calculate totalPrice with decimal unit price', () => {
      const decimalUnitPrice = Money.create({
        amount: 99.99,
        currency: CurrencyCodeEnum.USD,
      });
      const propsWithDecimal: OrderItemProps = {
        ...validProps,
        unitPrice: decimalUnitPrice,
        quantity: 3,
      };
      const orderItem = OrderItem.create(propsWithDecimal);

      expect(orderItem.totalPrice.props.amount).toBeCloseTo(299.97, 2);
    });
  });
});
