import { Command } from '@ecore/domain/core/cqrs/command';

export class CancelOrderCommand extends Command {
  constructor(public readonly orderId: string) {
    super();
  }
}
