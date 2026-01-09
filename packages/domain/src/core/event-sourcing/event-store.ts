import { Event } from './event';

export interface EventStore<T extends Event> {
  save(streamName: string, events: T[], expectedVersion: number): Promise<void>;
  get(streamName: string, fromVersion?: number): Promise<T[]>;
}
