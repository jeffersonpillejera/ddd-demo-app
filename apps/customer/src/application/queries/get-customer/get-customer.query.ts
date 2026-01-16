import { Query } from '@ecore/domain/core/cqrs/query';

export class GetCustomerQuery extends Query {
  constructor(public readonly id: string) {
    super();
  }
}
