import { RegisterUserDTO } from '../../dtos/customer.dto';

export class RegisterUserCommand {
  constructor(public readonly registerUserDTO: RegisterUserDTO) {}
}
