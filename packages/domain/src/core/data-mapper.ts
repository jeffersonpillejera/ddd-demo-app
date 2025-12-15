export interface IDataMapper<E, P = unknown> {
  toDomain(data: P): E;
  toPersistence(domain: E): P;
}
