import { Command } from './command';

export interface CommandHandler<T extends Command> {
  execute(command: T): Promise<void> | void;
}
