import { Order } from '../models/order';
import { Repository, filterOptions } from '@ecore/core/repository';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
export interface OrderFilter extends filterOptions<Order> {
  customerId?: string;
  status?: string;
}
export interface IOrderRepository extends Repository<Order> {
  findMany(filter?: OrderFilter): Promise<Order[]>;
}
