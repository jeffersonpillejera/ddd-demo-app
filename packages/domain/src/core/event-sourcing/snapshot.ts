import { AggregateRoot } from './aggregate-root';

export class Snapshot<T extends AggregateRoot<any>> {
  public id: string;
  public version: number;
  public createdAt: Date;
  public data: T;
}
