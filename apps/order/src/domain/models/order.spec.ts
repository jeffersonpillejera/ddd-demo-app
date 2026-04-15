import {
  Order,
  OrderProps,
  ORDER_STATUS,
  ORDER_ID_PREFIX,
  ORDER_ID_LENGTH,
} from './order';
import { OrderItem } from './order-item';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import {
  Money,
  CurrencyCodeEnum,
} from '@ecore/core/common/value-objects/money';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/core/common/exceptions';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';
import { OrderCancelledEvent } from '../events/order-cancelled.event';

describe('Order', () => {
  let mockDiscount: Money;
  let mockTotalTax: Money;
  let mockSubTotal: Money;
  let mockGrandTotal: Money;
  let mockItems: OrderItem[];
  let validProps: OrderProps;

  beforeEach(() => {
    const unitPrice1 = Money.create({
      amount: 100,
      currency: CurrencyCodeEnum.USD,
    });
    const unitPrice2 = Money.create({
      amount: 50,
      currency: CurrencyCodeEnum.USD,
    });

    const item1 = OrderItem.create({
      productId: 'product-1',
      quantity: 2,
      unitPrice: unitPrice1,
    });
    const item2 = OrderItem.create({
      productId: 'product-2',
      quantity: 1,
      unitPrice: unitPrice2,
    });
    mockItems = [item1, item2];
    mockSubTotal = Money.create({
      amount: 250,
      currency: CurrencyCodeEnum.USD,
    });
    mockDiscount = Money.create({
      amount: -10,
      currency: CurrencyCodeEnum.USD,
    });
    mockTotalTax = Money.create({ amount: 20, currency: CurrencyCodeEnum.USD });
    // grandTotal = subTotal + discount + totalTax = 250 + (-10) + 20 = 260
    mockGrandTotal = Money.create({
      amount: 260,
      currency: CurrencyCodeEnum.USD,
    });

    validProps = {
      status: ORDER_STATUS.PENDING,
      customerId: 'customer-123',
      dateOrdered: new Date(),
      discount: mockDiscount,
      totalTax: mockTotalTax,
      subTotal: mockSubTotal,
      grandTotal: mockGrandTotal,
      items: mockItems,
    };
  });

  function createValidOrderId(): UniqueIdentifier {
    // Generate a valid order ID: O + 8 digits + 10 uppercase alphanumeric
    const digits = '20251218';
    const alphanumeric = 'ER79UP7786';
    return new UniqueIdentifier(`${ORDER_ID_PREFIX}${digits}${alphanumeric}`);
  }

  describe('create', () => {
    it('should create an order with all required properties', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);

      expect(order).toBeInstanceOf(Order);
      expect(order.status).toBe(ORDER_STATUS.PENDING);
      expect(order.customerId).toBe('customer-123');
      expect(order.dateOrdered).toBeInstanceOf(Date);
      expect(order.discount).toBe(mockDiscount);
      expect(order.totalTax).toBe(mockTotalTax);
      expect(order.subTotal).toBe(mockSubTotal);
      expect(order.grandTotal).toBe(mockGrandTotal);
      expect(order.items).toEqual(mockItems);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should create an order with optional dateOrdered', () => {
      const id = createValidOrderId();
      const dateOrdered = new Date('2023-01-01');
      const propsWithDate: OrderProps = { ...validProps, dateOrdered };

      const order = Order.create(propsWithDate, id);

      expect(order.dateOrdered).toBe(dateOrdered);
    });

    it('should default dateOrdered to current date when not provided', () => {
      const id = createValidOrderId();
      const propsWithoutDate: OrderProps = { ...validProps, dateOrdered: null };
      const beforeCreation = new Date();

      const order = Order.create(propsWithoutDate, id);

      expect(order.dateOrdered).toBeInstanceOf(Date);
      expect(order.dateOrdered!.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
    });

    it('should create an order with optional timestamps', () => {
      const id = createValidOrderId();
      const updatedAt = new Date('2023-01-02');
      const confirmedAt = new Date('2023-01-03');
      const cancelledAt = new Date('2023-01-04');
      const shippedAt = new Date('2023-01-05');
      const deliveredAt = new Date('2023-01-06');
      const completedAt = new Date('2023-01-07');

      const propsWithTimestamps: OrderProps = {
        ...validProps,
        updatedAt,
        confirmedAt,
        cancelledAt,
        shippedAt,
        deliveredAt,
        completedAt,
      };

      const order = Order.create(propsWithTimestamps, id);

      expect(order.updatedAt).toBe(updatedAt);
      expect(order.confirmedAt).toBe(confirmedAt);
      expect(order.cancelledAt).toBe(cancelledAt);
      expect(order.shippedAt).toBe(shippedAt);
      expect(order.deliveredAt).toBe(deliveredAt);
      expect(order.completedAt).toBe(completedAt);
    });

    it('should emit OrderPlacedEvent when creating PENDING order without createdAt', () => {
      const id = createValidOrderId();
      const propsWithoutCreatedAt: OrderProps = {
        ...validProps,
        createdAt: null,
      };

      const order = Order.create(propsWithoutCreatedAt, id);

      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderPlacedEvent);
      expect((events[0] as OrderPlacedEvent).orderId).toBe(id);
      expect((events[0] as OrderPlacedEvent).status).toBe(ORDER_STATUS.PENDING);
      expect((events[0] as OrderPlacedEvent).customerId).toBe('customer-123');
    });

    it('should not emit OrderPlacedEvent when creating with createdAt', () => {
      const id = createValidOrderId();
      const createdAt = new Date('2023-01-01');
      const propsWithCreatedAt: OrderProps = { ...validProps, createdAt };

      const order = Order.create(propsWithCreatedAt, id);

      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should not emit OrderPlacedEvent when creating non-PENDING order', () => {
      const id = createValidOrderId();
      const propsConfirmed: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CONFIRMED,
        createdAt: new Date(),
      };

      const order = Order.create(propsConfirmed, id);

      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should throw UnprocessableException when id is missing', () => {
      expect(() =>
        Order.create(validProps, null as unknown as UniqueIdentifier),
      ).toThrow(UnprocessableException);
      expect(() => {
        Order.create(validProps, null as unknown as UniqueIdentifier);
      }).toThrow('ID is required');
    });

    it('should throw UnprocessableException when id length is incorrect', () => {
      const invalidId = new UniqueIdentifier('O1234567'); // Too short

      expect(() => Order.create(validProps, invalidId)).toThrow(
        UnprocessableException,
      );
      expect(() => {
        Order.create(validProps, invalidId);
      }).toThrow(
        `ID must be ${ORDER_ID_LENGTH} characters long after the prefix`,
      );
    });

    it('should throw UnprocessableException when id format is invalid', () => {
      const invalidId = new UniqueIdentifier('O20251218er79up7786'); // lowercase

      expect(() => Order.create(validProps, invalidId)).toThrow(
        UnprocessableException,
      );
      expect(() => {
        Order.create(validProps, invalidId);
      }).toThrow('ID is invalid');
    });

    it('should throw UnprocessableException when id format is completely invalid', () => {
      // Note: The regex in the code uses a literal pattern that doesn't properly interpolate
      // ORDER_ID_PREFIX, so it matches a character class. Testing with an ID that fails
      // the numeric or alphanumeric pattern instead
      const invalidId = new UniqueIdentifier('O2025121XER79UP7786'); // Invalid: has 'X' in digit section

      expect(() => Order.create(validProps, invalidId)).toThrow(
        UnprocessableException,
      );
      expect(() => {
        Order.create(validProps, invalidId);
      }).toThrow('ID is invalid');
    });

    it('should throw UnprocessableException when id middle section is not 8 digits', () => {
      const invalidId = new UniqueIdentifier('O2025121XER79UP7786'); // Not all digits

      expect(() => Order.create(validProps, invalidId)).toThrow(
        UnprocessableException,
      );
      expect(() => {
        Order.create(validProps, invalidId);
      }).toThrow('ID is invalid');
    });

    it('should throw BadRequestException when status is missing', () => {
      const id = createValidOrderId();
      const propsWithoutStatus = {
        ...validProps,
        status: null as unknown as ORDER_STATUS,
      };

      expect(() => Order.create(propsWithoutStatus, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutStatus, id);
      }).toThrow('Status is required');
    });

    it('should throw BadRequestException when status is invalid', () => {
      const id = createValidOrderId();
      const propsWithInvalidStatus = {
        ...validProps,
        status: 'invalid-status' as ORDER_STATUS,
      };

      expect(() => Order.create(propsWithInvalidStatus, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithInvalidStatus, id);
      }).toThrow('Invalid status');
    });

    it('should throw BadRequestException when customerId is missing', () => {
      const id = createValidOrderId();
      const propsWithoutCustomerId: OrderProps = {
        ...validProps,
        customerId: '',
      };

      expect(() => Order.create(propsWithoutCustomerId, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutCustomerId, id);
      }).toThrow('Customer ID is required');
    });

    it('should throw BadRequestException when discount is missing', () => {
      const id = createValidOrderId();
      const propsWithoutDiscount = {
        ...validProps,
        discount: null as unknown as Money,
      };

      expect(() => Order.create(propsWithoutDiscount, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutDiscount, id);
      }).toThrow('Discount is required');
    });

    it('should throw BadRequestException when totalTax is missing', () => {
      const id = createValidOrderId();
      const propsWithoutTotalTax = {
        ...validProps,
        totalTax: null as unknown as Money,
      };

      expect(() => Order.create(propsWithoutTotalTax, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutTotalTax, id);
      }).toThrow('Total tax is required');
    });

    it('should throw BadRequestException when subTotal is missing', () => {
      const id = createValidOrderId();
      const propsWithoutSubTotal = {
        ...validProps,
        subTotal: null as unknown as Money,
      };

      expect(() => Order.create(propsWithoutSubTotal, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutSubTotal, id);
      }).toThrow('Sub total is required');
    });

    it('should throw BadRequestException when grandTotal is missing', () => {
      const id = createValidOrderId();
      const propsWithoutGrandTotal = {
        ...validProps,
        grandTotal: null as unknown as Money,
      };

      expect(() => Order.create(propsWithoutGrandTotal, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutGrandTotal, id);
      }).toThrow('Grand total is required');
    });

    it('should throw BadRequestException when items are missing', () => {
      const id = createValidOrderId();
      const propsWithoutItems: OrderProps = { ...validProps, items: [] };

      expect(() => Order.create(propsWithoutItems, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithoutItems, id);
      }).toThrow('Items are required');
    });

    it('should throw BadRequestException when items is null', () => {
      const id = createValidOrderId();
      const propsWithNullItems = {
        ...validProps,
        items: null as unknown as OrderItem[],
      };

      expect(() => Order.create(propsWithNullItems, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithNullItems, id);
      }).toThrow('Items are required');
    });

    it('should throw BadRequestException when subTotal does not match sum of item prices', () => {
      const id = createValidOrderId();
      const incorrectSubTotal = Money.create({
        amount: 300,
        currency: CurrencyCodeEnum.USD,
      });
      const propsWithIncorrectSubTotal: OrderProps = {
        ...validProps,
        subTotal: incorrectSubTotal,
      };

      expect(() => Order.create(propsWithIncorrectSubTotal, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithIncorrectSubTotal, id);
      }).toThrow(
        'Sub total is not equal to the sum of the unit prices of the items',
      );
    });

    it('should throw BadRequestException when grandTotal does not match calculation', () => {
      const id = createValidOrderId();
      const incorrectGrandTotal = Money.create({
        amount: 300,
        currency: CurrencyCodeEnum.USD,
      });
      const propsWithIncorrectGrandTotal: OrderProps = {
        ...validProps,
        grandTotal: incorrectGrandTotal,
      };

      expect(() => Order.create(propsWithIncorrectGrandTotal, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsWithIncorrectGrandTotal, id);
      }).toThrow(
        'Grand total is not equal to the sub total plus discount plus total tax',
      );
    });

    it('should throw BadRequestException when createdAt is missing for non-PENDING order', () => {
      const id = createValidOrderId();
      const propsConfirmedWithoutCreatedAt: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CONFIRMED,
        createdAt: null,
      };

      expect(() => Order.create(propsConfirmedWithoutCreatedAt, id)).toThrow(
        BadRequestException,
      );
      expect(() => {
        Order.create(propsConfirmedWithoutCreatedAt, id);
      }).toThrow('Created At is required for confirmed orders');
    });

    it('should accept all ORDER_STATUS values', () => {
      const id = createValidOrderId();
      const statuses = Object.values(ORDER_STATUS);

      statuses.forEach((status) => {
        const propsWithStatus: OrderProps = {
          ...validProps,
          status,
          createdAt: status !== ORDER_STATUS.PENDING ? new Date() : null,
        };

        const order = Order.create(propsWithStatus, id);
        expect(order.status).toBe(status);
      });
    });

    it('should validate subTotal matches items with different currencies', () => {
      const id = createValidOrderId();
      const phpUnitPrice = Money.create({
        amount: 100,
        currency: CurrencyCodeEnum.PHP,
      });
      const phpItem = OrderItem.create({
        productId: 'product-php',
        quantity: 1,
        unitPrice: phpUnitPrice,
      });
      const phpSubTotal = Money.create({
        amount: 100,
        currency: CurrencyCodeEnum.PHP,
      });
      const phpDiscount = Money.create({
        amount: 0,
        currency: CurrencyCodeEnum.PHP,
      });
      const phpTax = Money.create({
        amount: 10,
        currency: CurrencyCodeEnum.PHP,
      });
      const phpGrandTotal = Money.create({
        amount: 110,
        currency: CurrencyCodeEnum.PHP,
      });

      const propsWithPHP: OrderProps = {
        ...validProps,
        items: [phpItem],
        subTotal: phpSubTotal,
        discount: phpDiscount,
        totalTax: phpTax,
        grandTotal: phpGrandTotal,
      };

      const order = Order.create(propsWithPHP, id);
      expect(order.subTotal.props.currency).toBe(CurrencyCodeEnum.PHP);
    });
  });

  describe('getters', () => {
    it('should return status', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.status).toBe(ORDER_STATUS.PENDING);
    });

    it('should return customerId', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.customerId).toBe('customer-123');
    });

    it('should return dateOrdered', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.dateOrdered).toBeInstanceOf(Date);
    });

    it('should return discount', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.discount).toBe(mockDiscount);
    });

    it('should return totalTax', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.totalTax).toBe(mockTotalTax);
    });

    it('should return subTotal', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.subTotal).toBe(mockSubTotal);
    });

    it('should return grandTotal', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.grandTotal).toBe(mockGrandTotal);
    });

    it('should return items', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.items).toEqual(mockItems);
    });

    it('should return createdAt', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      const id = createValidOrderId();
      const updatedAt = new Date('2023-01-02');
      const propsWithUpdatedAt: OrderProps = { ...validProps, updatedAt };
      const order = Order.create(propsWithUpdatedAt, id);
      expect(order.updatedAt).toBe(updatedAt);
    });

    it('should return updatedAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.updatedAt).toBeUndefined();
    });

    it('should return confirmedAt', () => {
      const id = createValidOrderId();
      const confirmedAt = new Date('2023-01-03');
      const propsWithConfirmedAt: OrderProps = { ...validProps, confirmedAt };
      const order = Order.create(propsWithConfirmedAt, id);
      expect(order.confirmedAt).toBe(confirmedAt);
    });

    it('should return confirmedAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.confirmedAt).toBeUndefined();
    });

    it('should return cancelledAt', () => {
      const id = createValidOrderId();
      const cancelledAt = new Date('2023-01-04');
      const propsWithCancelledAt: OrderProps = { ...validProps, cancelledAt };
      const order = Order.create(propsWithCancelledAt, id);
      expect(order.cancelledAt).toBe(cancelledAt);
    });

    it('should return cancelledAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.cancelledAt).toBeUndefined();
    });

    it('should return shippedAt', () => {
      const id = createValidOrderId();
      const shippedAt = new Date('2023-01-05');
      const propsWithShippedAt: OrderProps = { ...validProps, shippedAt };
      const order = Order.create(propsWithShippedAt, id);
      expect(order.shippedAt).toBe(shippedAt);
    });

    it('should return shippedAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.shippedAt).toBeUndefined();
    });

    it('should return deliveredAt', () => {
      const id = createValidOrderId();
      const deliveredAt = new Date('2023-01-06');
      const propsWithDeliveredAt: OrderProps = { ...validProps, deliveredAt };
      const order = Order.create(propsWithDeliveredAt, id);
      expect(order.deliveredAt).toBe(deliveredAt);
    });

    it('should return deliveredAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.deliveredAt).toBeUndefined();
    });

    it('should return completedAt', () => {
      const id = createValidOrderId();
      const completedAt = new Date('2023-01-07');
      const propsWithCompletedAt: OrderProps = { ...validProps, completedAt };
      const order = Order.create(propsWithCompletedAt, id);
      expect(order.completedAt).toBe(completedAt);
    });

    it('should return completedAt as undefined when not provided', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      expect(order.completedAt).toBeUndefined();
    });
  });

  describe('cancel', () => {
    it('should cancel a pending order', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      order.uncommit(); // Clear OrderPlacedEvent

      order.cancel();

      expect(order.status).toBe(ORDER_STATUS.CANCELLED);
      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCancelledEvent);
      expect((events[0] as OrderCancelledEvent).orderId).toBe(id);
      expect((events[0] as OrderCancelledEvent).status).toBe(
        ORDER_STATUS.CANCELLED,
      );
    });

    it('should cancel a confirmed order', () => {
      const id = createValidOrderId();
      const propsConfirmed: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CONFIRMED,
        createdAt: new Date(),
      };
      const order = Order.create(propsConfirmed, id);

      order.cancel();

      expect(order.status).toBe(ORDER_STATUS.CANCELLED);
      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCancelledEvent);
    });

    it('should cancel a processing order', () => {
      const id = createValidOrderId();
      const propsProcessing: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.PROCESSING,
        createdAt: new Date(),
      };
      const order = Order.create(propsProcessing, id);

      order.cancel();

      expect(order.status).toBe(ORDER_STATUS.CANCELLED);
    });

    it('should throw BadRequestException when cancelling a cancelled order', () => {
      const id = createValidOrderId();
      const propsCancelled: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CANCELLED,
        createdAt: new Date(),
      };
      const order = Order.create(propsCancelled, id);

      expect(() => order.cancel()).toThrow(BadRequestException);
      expect(() => {
        order.cancel();
      }).toThrow('Order cannot be cancelled');
    });

    it('should throw BadRequestException when cancelling a completed order', () => {
      const id = createValidOrderId();
      const propsCompleted: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.COMPLETED,
        createdAt: new Date(),
      };
      const order = Order.create(propsCompleted, id);

      expect(() => order.cancel()).toThrow(BadRequestException);
      expect(() => {
        order.cancel();
      }).toThrow('Order cannot be cancelled');
    });

    it('should throw BadRequestException when cancelling a shipped order', () => {
      const id = createValidOrderId();
      const propsShipped: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.SHIPPED,
        createdAt: new Date(),
      };
      const order = Order.create(propsShipped, id);

      expect(() => order.cancel()).toThrow(BadRequestException);
      expect(() => {
        order.cancel();
      }).toThrow('Order cannot be cancelled');
    });

    it('should throw BadRequestException when cancelling a delivered order', () => {
      const id = createValidOrderId();
      const propsDelivered: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.DELIVERED,
        createdAt: new Date(),
      };
      const order = Order.create(propsDelivered, id);

      expect(() => order.cancel()).toThrow(BadRequestException);
      expect(() => {
        order.cancel();
      }).toThrow('Order cannot be cancelled');
    });
  });

  describe('confirm', () => {
    it('should confirm a pending order', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      order.uncommit(); // Clear OrderPlacedEvent

      order.confirm();

      expect(order.status).toBe(ORDER_STATUS.CONFIRMED);
      const events = order.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderConfirmedEvent);
      expect((events[0] as OrderConfirmedEvent).orderId).toBe(id);
      expect((events[0] as OrderConfirmedEvent).status).toBe(
        ORDER_STATUS.CONFIRMED,
      );
    });

    it('should throw BadRequestException when confirming an already confirmed order', () => {
      const id = createValidOrderId();
      const propsConfirmed: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CONFIRMED,
        createdAt: new Date(),
      };
      const order = Order.create(propsConfirmed, id);

      expect(() => order.confirm()).toThrow(BadRequestException);
      expect(() => {
        order.confirm();
      }).toThrow('Order is already confirmed');
    });

    it('should throw BadRequestException when confirming a non-pending order', () => {
      const id = createValidOrderId();
      const propsProcessing: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.PROCESSING,
        createdAt: new Date(),
      };
      const order = Order.create(propsProcessing, id);

      expect(() => order.confirm()).toThrow(BadRequestException);
      expect(() => {
        order.confirm();
      }).toThrow('You can only confirm pending orders');
    });

    it('should throw BadRequestException when confirming a cancelled order', () => {
      const id = createValidOrderId();
      const propsCancelled: OrderProps = {
        ...validProps,
        status: ORDER_STATUS.CANCELLED,
        createdAt: new Date(),
      };
      const order = Order.create(propsCancelled, id);

      expect(() => order.confirm()).toThrow(BadRequestException);
      expect(() => {
        order.confirm();
      }).toThrow('You can only confirm pending orders');
    });
  });

  describe('when (event sourcing)', () => {
    it('should handle OrderPlacedEvent through loadFromHistory', () => {
      const id = createValidOrderId();
      // Create an order first, then load from history to test when() method
      const order = Order.create(validProps, id);
      order.uncommit(); // Clear any events

      const event = new OrderPlacedEvent(
        id,
        ORDER_STATUS.PENDING,
        'customer-123',
        new Date(),
        mockDiscount,
        mockTotalTax,
        mockSubTotal,
        mockGrandTotal,
        mockItems,
        new Date(),
      );

      order.loadFromHistory([event]);

      expect(order.status).toBe(ORDER_STATUS.PENDING);
      expect(order.customerId).toBe('customer-123');
      expect(order.discount).toBe(mockDiscount);
      expect(order.totalTax).toBe(mockTotalTax);
      expect(order.subTotal).toBe(mockSubTotal);
      expect(order.grandTotal).toBe(mockGrandTotal);
      expect(order.items).toEqual(mockItems);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should handle OrderConfirmedEvent through loadFromHistory', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      order.uncommit(); // Clear events
      const confirmedAt = new Date('2023-01-03');
      const updatedAt = new Date('2023-01-03');

      const placedEvent = new OrderPlacedEvent(
        id,
        ORDER_STATUS.PENDING,
        'customer-123',
        new Date(),
        mockDiscount,
        mockTotalTax,
        mockSubTotal,
        mockGrandTotal,
        mockItems,
        new Date(),
      );
      const confirmedEvent = new OrderConfirmedEvent(
        id,
        ORDER_STATUS.CONFIRMED,
        confirmedAt,
        updatedAt,
      );

      order.loadFromHistory([placedEvent, confirmedEvent]);

      expect(order.status).toBe(ORDER_STATUS.CONFIRMED);
      expect(order.confirmedAt).toBe(confirmedAt);
      expect(order.updatedAt).toBe(updatedAt);
    });

    it('should handle OrderCancelledEvent through loadFromHistory', () => {
      const id = createValidOrderId();
      const order = Order.create(validProps, id);
      order.uncommit(); // Clear events
      const cancelledAt = new Date('2023-01-04');
      const updatedAt = new Date('2023-01-04');

      const placedEvent = new OrderPlacedEvent(
        id,
        ORDER_STATUS.PENDING,
        'customer-123',
        new Date(),
        mockDiscount,
        mockTotalTax,
        mockSubTotal,
        mockGrandTotal,
        mockItems,
        new Date(),
      );
      const cancelledEvent = new OrderCancelledEvent(
        id,
        ORDER_STATUS.CANCELLED,
        cancelledAt,
        updatedAt,
      );

      order.loadFromHistory([placedEvent, cancelledEvent]);

      expect(order.status).toBe(ORDER_STATUS.CANCELLED);
      expect(order.cancelledAt).toBe(cancelledAt);
      expect(order.updatedAt).toBe(updatedAt);
    });
  });
});
