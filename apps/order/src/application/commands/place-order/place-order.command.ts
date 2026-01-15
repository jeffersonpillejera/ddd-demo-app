import { Command } from '@ecore/domain/core/cqrs/command';
import { PlaceOrderDTO } from '../../dtos/order.dto';

export class PlaceOrderCommand extends Command {
  constructor(public readonly placeOrderDTO: PlaceOrderDTO) {
    super();
  }
}
