import { Command } from '@nestjs/cqrs';

export class ConfirmOrderCommand extends Command<void> {
  constructor(public readonly orderId: string) {
    super();
  }
}
