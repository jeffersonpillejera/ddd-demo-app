import { DomainError } from '../../domain-error';

export class NotFoundException extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}
