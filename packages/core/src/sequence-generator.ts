import { UniqueIdentifier } from './unique-identifier';

export const SEQUENCE_GENERATOR_TOKEN = Symbol('SEQUENCE_GENERATOR_TOKEN');

export interface SequenceGenerator {
  generateId(prefix?: string): Promise<UniqueIdentifier> | UniqueIdentifier;
}
