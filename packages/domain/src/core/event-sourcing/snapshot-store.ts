import { AggregateRoot } from './aggregate-root';
import { Snapshot } from './snapshot';

export interface SnapshotStore<T extends AggregateRoot<any>> {
  save(id: string, aggregate: T, version: number): Promise<void>;
  get(id: string, aggregateType: string): Promise<Snapshot<T> | null>;
}
