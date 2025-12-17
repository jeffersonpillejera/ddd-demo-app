import { DomainError } from '../../core/domain-error';

export class UnprocessableException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
