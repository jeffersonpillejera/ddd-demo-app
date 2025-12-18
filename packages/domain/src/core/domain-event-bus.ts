import { AggregateRoot } from './aggregate-root';

export interface DomainEventBus {
  publish<T extends AggregateRoot<any>>(aggregateRoot: T): void;
}
