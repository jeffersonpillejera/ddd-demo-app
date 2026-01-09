import { SnapshotStore as DomainSnapshotStore } from '@ecore/domain/core/event-sourcing/snapshot-store';
import { Model } from 'mongoose';
import { SnapshotEntity } from './snapshot.schema';
import { AggregateRoot } from '@ecore/domain/core/event-sourcing/aggregate-root';
import { Snapshot } from '@ecore/domain/core/event-sourcing/snapshot';
import { DataMapper } from '@ecore/domain/core/data-mapper';

export class SnapshotStore<
  T extends AggregateRoot<any>,
> implements DomainSnapshotStore<T> {
  constructor(
    private readonly snapshotModel: Model<SnapshotEntity>,
    private readonly dataMapper: DataMapper<T, Record<string, any>>,
  ) {}

  async save(id: string, aggregate: T, version: number): Promise<void> {
    await this.snapshotModel.create({
      id,
      aggregateId: aggregate.id.toString(),
      aggregateType: aggregate.constructor.name,
      version,
      createdAt: new Date(),
      data: this.dataMapper.toPersistence(aggregate),
    });
  }

  async get(id: string, aggregateType: string): Promise<Snapshot<T> | null> {
    const snapshot = await this.snapshotModel
      .findOne({ id, aggregateType })
      .lean();
    if (!snapshot) return null;
    return {
      id: snapshot.id,
      version: snapshot.version,
      createdAt: snapshot.createdAt,
      data: this.dataMapper.toDomain(snapshot.data),
    };
  }
}
