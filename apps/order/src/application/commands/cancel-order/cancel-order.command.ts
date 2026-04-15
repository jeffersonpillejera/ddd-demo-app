import { Command } from '@nestjs/cqrs';

export class CancelOrderCommand extends Command<void> {
  constructor(public readonly orderId: string) {
    super();
  }
}
