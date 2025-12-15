import { ValueObjectProps, ValueObject } from '../../core/value-object';

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

  public add(money: Money): Money {
    if (this.props.currency !== money.props.currency) {
      throw new Error('Cannot add money with different currencies');
    }

    return new Money({
      amount: this.props.amount + money.props.amount,
      currency: this.props.currency,
    });
  }

  public static create({ amount, currency }: MoneyProps): Money {
    if (amount === undefined || amount === null || isNaN(amount)) {
      throw new Error('Amount must be a number');
    }
    if (!currency || !Object.values(CurrencyCodeEnum).includes(currency)) {
      throw new Error('Currency must be a valid currency code');
    }
    return new Money({ amount, currency });
  }
}
