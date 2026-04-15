import { Command } from '@nestjs/cqrs';
import { IPlaceOrderDTO } from '../../dto.interface';

export class PlaceOrderCommand extends Command<void> {
  constructor(public readonly placeOrderDTO: IPlaceOrderDTO) {
    super();
  }
}
