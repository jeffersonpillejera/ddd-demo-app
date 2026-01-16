import { DomainEvent } from '../domain-event';

export interface EventStore<T extends DomainEvent> {
  save(streamName: string, events: T[], expectedVersion: number): Promise<void>;
  get(streamName: string, fromVersion?: number): Promise<T[]>;
}
