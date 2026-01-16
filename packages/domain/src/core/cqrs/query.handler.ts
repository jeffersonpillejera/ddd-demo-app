import { Query } from './query';

export interface QueryHandler<T extends Query, R> {
  execute(query: T): Promise<R> | R;
}
