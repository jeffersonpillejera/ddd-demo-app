import { Command } from '@nestjs/cqrs';
import { ICreditPurchaseDTO } from '../../dto.interface';

export class CreditPurchaseCommand extends Command<void> {
  constructor(public readonly creditPurchaseDTO: ICreditPurchaseDTO) {
    super();
  }
}
