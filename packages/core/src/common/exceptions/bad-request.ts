import { DomainError } from '../../domain-error';

export class BadRequestException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
