import { AggregateRoot } from './aggregate-root';

export interface IDomainEventBus {
  publish<T extends AggregateRoot<any>>(aggregateRoot: T): void;
}
