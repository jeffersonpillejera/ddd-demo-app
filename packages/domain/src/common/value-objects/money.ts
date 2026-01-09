import { ValueObjectProps, ValueObject } from '../../core/value-object';
import { BadRequestException } from '../../common/exceptions';

export enum CurrencyCodeEnum {
  USD = 'USD',
  PHP = 'PHP',
}

export interface MoneyProps extends ValueObjectProps {
  amount: number;
  currency: CurrencyCodeEnum;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor({ amount, currency }: MoneyProps) {
    super({ amount, currency });
  }

  get value(): MoneyProps {
    return this.props;
  }

  public add(addend: Money | number): Money {
    if (typeof addend === 'number') {
      return new Money({
        amount: this.props.amount + addend,
        currency: this.props.currency,
      });
    }
    if (this.props.currency !== addend.props.currency) {
      throw new BadRequestException(
        'Cannot add money with different currencies',
      );
    }

    return new Money({
      amount: this.props.amount + addend.props.amount,
      currency: this.props.currency,
    });
  }

  public subtract(subtrahend: Money | number): Money {
    if (typeof subtrahend === 'number') {
      return new Money({
        amount: this.props.amount - subtrahend,
        currency: this.props.currency,
      });
    }
    if (this.props.currency !== subtrahend.props.currency) {
      throw new BadRequestException(
        'Cannot subtract money with different currencies',
      );
    }
    return new Money({
      amount: this.props.amount - subtrahend.props.amount,
      currency: this.props.currency,
    });
  }

  public multiply(multiplier: Money | number): Money {
    if (typeof multiplier === 'number') {
      return new Money({
        amount: this.props.amount * multiplier,
        currency: this.props.currency,
      });
    }
    if (this.props.currency !== multiplier.props.currency) {
      throw new BadRequestException(
        'Cannot multiply money with different currencies',
      );
    }
    return new Money({
      amount: this.props.amount * multiplier.props.amount,
      currency: this.props.currency,
    });
  }

  public divide(divisor: Money | number): Money {
    if (typeof divisor === 'number') {
      return new Money({
        amount: this.props.amount / divisor,
        currency: this.props.currency,
      });
    }
    if (this.props.currency !== divisor.props.currency) {
      throw new BadRequestException(
        'Cannot divide money with different currencies',
      );
    }
    return new Money({
      amount: this.props.amount / divisor.props.amount,
      currency: this.props.currency,
    });
  }

  public static create({ amount, currency }: MoneyProps): Money {
    if (amount === undefined || amount === null || isNaN(amount)) {
      throw new BadRequestException('Amount must be a number');
    }
    if (!currency || !Object.values(CurrencyCodeEnum).includes(currency)) {
      throw new BadRequestException('Currency must be a valid currency code');
    }
    return new Money({ amount, currency });
  }
}
