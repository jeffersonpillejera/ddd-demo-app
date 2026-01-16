import { AggregateRoot as BaseAggregateRoot } from '../aggregate-root';
import { DomainEvent } from '../domain-event';

export abstract class AggregateRoot<T> extends BaseAggregateRoot<T> {
  private _version: number;

  get version(): number {
    return this._version;
  }

  protected apply(event: DomainEvent): void {
    super.apply(event);
    this.when(event);
  }

  protected abstract when<T extends DomainEvent>(event: T): void;

  public loadFromHistory(events: DomainEvent[]): void {
    events
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
      .forEach((event) => this.when(event));
    this._version = events.length;
  }
}
