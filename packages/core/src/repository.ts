export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface filterOptions<T = Record<string, unknown>> {
  skip?: number;
  take?: number;
  sort?: keyof T;
  sortOrder?: SortOrder;
}

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: filterOptions<T>): Promise<T[]>;
  save(entity: T): Promise<T>;
}
