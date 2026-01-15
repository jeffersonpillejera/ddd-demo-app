import { Command } from '@ecore/domain/core/cqrs/command';
import { CreditPurchaseDTO } from '../../dtos/customer.dto';

export class CreditPurchaseCommand extends Command {
  constructor(public readonly creditPurchaseDTO: CreditPurchaseDTO) {
    super();
  }
}
