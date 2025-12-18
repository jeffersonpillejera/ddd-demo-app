import { ConsoleLoggerOptions, DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({ providers: [LoggerService], exports: [LoggerService] })
export class LoggerModule {
  static register(options?: ConsoleLoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
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
