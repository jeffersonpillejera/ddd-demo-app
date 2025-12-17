import { ConsoleLogger, Scope } from '@nestjs/common';
import { ILogger } from '@ecore/domain/core/logger';
import { Injectable } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements ILogger {
  setContext(context: string): void {
    super.setContext(context);
  }
}
