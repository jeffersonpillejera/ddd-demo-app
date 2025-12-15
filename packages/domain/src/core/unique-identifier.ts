import { Identifier } from './identifier';

export class UniqueIdentifier extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ?? crypto.randomUUID());
  }
}
