import { DomainError } from '../../domain-error';

export class UnprocessableException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
