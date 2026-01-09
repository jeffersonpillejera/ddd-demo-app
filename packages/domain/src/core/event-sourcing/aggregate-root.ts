import { AggregateRoot as BaseAggregateRoot } from '../aggregate-root';
import { DomainEvent } from '../domain-event';
import { Event } from './event';

export abstract class AggregateRoot<T> extends BaseAggregateRoot<T> {
  private _version: number;

  get version(): number {
    return this._version;
  }

  protected addDomainEvent(domainEvent: DomainEvent & Event): void {
    super.addDomainEvent(domainEvent);
    this.when(domainEvent);
  }

  protected abstract when<T extends Event>(event: T): void;

  public rebuild(events: Event[]): void {
    events
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
      .forEach((event) => this.when(event));
    this._version = events.length;
  }
}
