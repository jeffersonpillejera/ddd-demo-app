import { DomainError } from '../../domain-error';

export class UnauthorizedException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
