import { Query } from '@ecore/domain/core/cqrs/query';

export class GetOrderQuery extends Query {
  constructor(public readonly orderId: string) {
    super();
  }
}
