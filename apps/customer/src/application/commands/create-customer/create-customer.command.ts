import { Command } from '@ecore/domain/core/cqrs/command';
import { CreateCustomerDTO } from '../../dtos/customer.dto';

export class CreateCustomerCommand extends Command {
  constructor(public readonly createCustomerDTO: CreateCustomerDTO) {
    super();
  }
}
