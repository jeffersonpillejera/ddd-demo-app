import { UniqueIdentifier } from './unique-identifier';

export interface SequenceGenerator {
  generateId(prefix?: string): Promise<UniqueIdentifier> | UniqueIdentifier;
}
