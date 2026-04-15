import { ConsoleLogger, Scope } from '@nestjs/common';
import { type ILogger } from '@ecore/core/logger';
import { Injectable } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements ILogger {}
