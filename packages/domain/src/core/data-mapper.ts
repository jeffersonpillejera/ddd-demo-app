import { Money, MoneyProps } from '../common/value-objects/money';

export abstract class DataMapper<E, P = unknown> {
  abstract toDomain(data: P): E;
  abstract toPersistence(domain: E): P;
  protected toMoney(props: MoneyProps): Money {
    return Money.create({ amount: props.amount, currency: props.currency });
  }
}
