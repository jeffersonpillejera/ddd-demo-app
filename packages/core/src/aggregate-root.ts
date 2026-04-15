import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  protected readonly _domainEvents: DomainEvent[] = [];

  getUncommittedEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected apply(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public uncommit(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
