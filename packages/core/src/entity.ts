import { UniqueIdentifier } from './unique-identifier';

export abstract class Entity<T> {
  private readonly _id: UniqueIdentifier;
  protected props: T;

  constructor(props: T, id?: UniqueIdentifier) {
    this._id = id ?? new UniqueIdentifier();
    this.props = props;
  }

  get id(): UniqueIdentifier {
    return this._id;
  }

  public isEqualTo(entity?: Entity<T>): boolean {
    if (!entity || !this.isEntity(entity)) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id.equals(entity._id);
  }

  private isEntity(v: any): v is Entity<T> {
    return v instanceof Entity;
  }
}
