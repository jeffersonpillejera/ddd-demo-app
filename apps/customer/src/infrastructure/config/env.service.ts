import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EnvConfig,
  DatabaseConfig,
  ServerConfig,
  EventBusConfig,
} from './env.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  readonly database: DatabaseConfig;
  readonly server: ServerConfig;
  readonly eventBus: EventBusConfig;

  constructor(private readonly configService: ConfigService) {
    this.database = { url: configService.get<string>('DATABASE_URL')! };

    this.server = {
      nodeEnv: configService.get<string>('NODE_ENV'),
      port: configService.get<number>('PORT'),
      allowedOrigins:
        configService.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [],
    };

    this.eventBus = {
      host: configService.get<string>('EVENT_BUS_HOST')!,
      port: configService.get<number>('EVENT_BUS_PORT')!,
    };
  }
}
