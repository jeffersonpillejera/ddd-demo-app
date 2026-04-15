import {
  ConsoleLoggerOptions,
  DynamicModule,
  Module,
  Scope,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LOGGER_TOKEN } from './constants';

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
        {
          provide: LOGGER_TOKEN,
          scope: Scope.TRANSIENT,
          // useExisting: LoggerService, <-- TRANSIENT doesn't work with the useExisting
          useFactory: () =>
            new LoggerService(
              options ?? {
                logLevels: ['error', 'warn', 'log'],
                prefix: 'Ecore',
              },
            ),
        },
      ],
      exports: [LoggerService, LOGGER_TOKEN],
    };
  }
}
