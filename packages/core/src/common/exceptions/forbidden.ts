import { DomainError } from '../../domain-error';

export class ForbiddenException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
