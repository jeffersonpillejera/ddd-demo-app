import { Command } from '@nestjs/cqrs';
import { ICreateCustomerDTO } from '../../dto.interface';

export class CreateCustomerCommand extends Command<void> {
  constructor(public readonly createCustomerDTO: ICreateCustomerDTO) {
    super();
  }
}
