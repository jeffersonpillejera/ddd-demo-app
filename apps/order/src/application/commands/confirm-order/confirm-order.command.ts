import { Command } from '@ecore/domain/core/cqrs/command';

export class ConfirmOrderCommand extends Command {
  constructor(public readonly orderId: string) {
    super();
  }
}
