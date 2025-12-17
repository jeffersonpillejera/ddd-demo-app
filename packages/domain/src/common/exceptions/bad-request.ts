import { DomainError } from '../../core/domain-error';

export class BadRequestException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
