import { DomainError } from '../../core/domain-error';

export class ForbiddenException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
