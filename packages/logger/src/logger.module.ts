import {
  ConsoleLoggerOptions,
  DynamicModule,
  Module,
  Scope,
} from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({})
export class LoggerModule {
  static register(options?: ConsoleLoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          scope: Scope.TRANSIENT,
          useFactory: () =>
            new LoggerService(
              options ?? {
                logLevels: ['error', 'warn', 'log'],
                prefix: 'Ecore',
              },
            ),
        },
      ],
      exports: [LoggerService],
    };
  }
}
