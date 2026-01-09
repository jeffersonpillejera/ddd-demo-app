import { Order } from '../models/order';
import { Repository } from '@ecore/domain/core/repository';

export interface OrderRepository extends Repository<Order> {
  findById(id: string): Promise<Order | null>;
}
